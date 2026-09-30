"""
JalVedh AI - Side-Scan Sonar (SSS) Advanced Preprocessing & Navigation Pipeline
PS-57 Defense Marine Debris Intelligence
"""

import os
import math
import numpy as np
import cv2
from typing import Dict, List, Tuple, Optional, Any
from nav_parser import SonarNavParser, SonarMetadataError


class SonarPreprocessor:
    """
    Configurable, defense-grade Side-Scan Sonar (SSS) Preprocessing Module:
    1. Ping Nav & Header Ingestion (XTF/JSF/CSV) via SonarNavParser
    2. Radiometric Time-Varied Gain (TVG) & Beam Pattern Normalization
    3. Slant-Range to Ground-Range Geometric Correction: Y_g = sqrt(R_s^2 - A^2)
    4. Water-Column / Nadir Gap Removal
    5. Ping Dropout Line Detection & Interpolation
    6. Speckle Reduction (Lee, Bilateral, Frost Filtering)
    7. Overlapping Waterfall Tiling (1024x1024, 25% overlap) & Seam NMS Merging
    """

    def __init__(
        self,
        target_resolution_m: float = 0.1,  # 0.1 m/pixel constant physical grid
        default_altitude_m: Optional[float] = None,
        default_slant_range_m: Optional[float] = None,
        tile_size: int = 1024,
        tile_overlap_ratio: float = 0.25,
        speckle_filter: str = "lee"  # 'lee', 'bilateral', 'frost', or 'none'
    ):
        self.target_resolution_m = target_resolution_m
        self.default_altitude_m = default_altitude_m
        self.default_slant_range_m = default_slant_range_m
        self.tile_size = tile_size
        self.tile_overlap_ratio = tile_overlap_ratio
        self.speckle_filter = speckle_filter

    def parse_nav_metadata(
        self,
        nav_dict: Optional[Dict[str, Any]] = None,
        strict: bool = False
    ) -> Dict[str, Any]:
        """Parses and validates navigation metadata."""
        if nav_dict is None:
            nav_dict = {}
        if self.default_altitude_m is not None and "altitude_m" not in nav_dict:
            nav_dict["altitude_m"] = self.default_altitude_m
        if self.default_slant_range_m is not None and "slant_range_m" not in nav_dict:
            nav_dict["slant_range_m"] = self.default_slant_range_m

        return SonarNavParser.parse_dict(nav_dict, strict=strict)

    def apply_tvg_correction(self, raw_intensity: np.ndarray) -> np.ndarray:
        """
        Applies empirical Time-Varied Gain (TVG) and across-track beam pattern correction.
        Normalizes intensity roll-off from nadir to far-range.
        """
        if len(raw_intensity.shape) == 3:
            gray = cv2.cvtColor(raw_intensity, cv2.COLOR_BGR2GRAY)
        else:
            gray = raw_intensity.copy()

        h, w = gray.shape
        if w < 10:
            return gray

        # Compute average across-track intensity profile
        profile = np.mean(gray, axis=0, dtype=np.float32) + 1e-5
        
        # Smooth profile to capture beam pattern without local target variations
        kernel_size = max(15, int(w * 0.08) | 1)
        smoothed_profile = cv2.GaussianBlur(profile.reshape(1, -1), (kernel_size, 1), 0).flatten()

        target_gain = np.median(smoothed_profile)
        gain_curve = target_gain / (smoothed_profile + 1e-5)
        # Clip gain curve to prevent runaway amplification of far-range noise
        gain_curve = np.clip(gain_curve, 0.4, 2.5)

        corrected = (gray.astype(np.float32) * gain_curve).clip(0, 255).astype(np.uint8)
        return corrected

    def correct_slant_to_ground_range(
        self,
        img: np.ndarray,
        altitude_m: float,
        slant_range_m: float
    ) -> Tuple[np.ndarray, float]:
        """
        Converts slant-range sonar waterfall to true horizontal ground-range:
        Y_ground = sqrt(R_slant^2 - Altitude^2)
        Removes the blind nadir water-column gap.
        """
        h, w = img.shape[:2]
        if altitude_m <= 0 or slant_range_m <= altitude_m:
            return img, self.target_resolution_m

        half_w = w // 2
        slant_res = slant_range_m / float(half_w + 1e-5)
        
        # Max ground range on each side
        max_ground_range = math.sqrt(max(1.0, slant_range_m**2 - altitude_m**2))
        ground_half_w = int(max_ground_range / self.target_resolution_m)
        
        if ground_half_w <= 10:
            return img, self.target_resolution_m

        # Build ground-range remap grid for Port and Starboard channels
        ground_x = np.arange(ground_half_w, dtype=np.float32) * self.target_resolution_m
        slant_dist = np.sqrt(ground_x**2 + altitude_m**2)
        slant_px = slant_dist / slant_res

        # Remap Port (left) and Starboard (right)
        port_src = half_w - 1 - slant_px
        stbd_src = half_w + slant_px

        port_valid = (port_src >= 0) & (port_src < half_w)
        stbd_valid = (stbd_src >= half_w) & (stbd_src < w)

        out_port = np.zeros((h, ground_half_w), dtype=np.uint8)
        out_stbd = np.zeros((h, ground_half_w), dtype=np.uint8)

        for row in range(h):
            out_port[row, port_valid] = np.interp(port_src[port_valid], np.arange(half_w), img[row, :half_w])
            out_stbd[row, stbd_valid] = np.interp(stbd_src[stbd_valid], np.arange(half_w, w), img[row, half_w:])

        corrected = np.hstack([np.fliplr(out_port), out_stbd])
        return corrected, self.target_resolution_m

    def handle_ping_dropouts(self, img: np.ndarray) -> Tuple[np.ndarray, List[int]]:
        """
        Detects missing/zeroed ping lines caused by vehicle heave or acoustic dropout.
        Interpolates across single-ping dropouts and records dropout row indices.
        """
        h, w = img.shape[:2]
        row_energy = np.mean(img, axis=1)
        dropout_rows = np.where(row_energy < 3.0)[0].tolist()

        if not dropout_rows or len(dropout_rows) >= h * 0.5:
            return img, dropout_rows

        cleaned = img.copy()
        for r in dropout_rows:
            prev_r = max(0, r - 1)
            next_r = min(h - 1, r + 1)
            if prev_r not in dropout_rows and next_r not in dropout_rows:
                cleaned[r] = ((cleaned[prev_r].astype(np.uint16) + cleaned[next_r].astype(np.uint16)) // 2).astype(np.uint8)

        return cleaned, dropout_rows

    def apply_speckle_filter(self, img: np.ndarray) -> np.ndarray:
        """
        Acoustic speckle attenuation (Lee, Bilateral, or Frost).
        """
        if self.speckle_filter == "bilateral":
            return cv2.bilateralFilter(img, d=7, sigmaColor=60, sigmaSpace=60)
        elif self.speckle_filter == "lee":
            # Lee Adaptive Spatial Speckle Filter
            mean = cv2.blur(img.astype(np.float32), (5, 5))
            mean_sq = cv2.blur(img.astype(np.float32)**2, (5, 5))
            var = mean_sq - mean**2
            overall_var = np.var(img) + 1e-5
            k = var / (var + overall_var)
            lee_out = mean + k * (img.astype(np.float32) - mean)
            return np.clip(lee_out, 0, 255).astype(np.uint8)
        elif self.speckle_filter == "frost":
            # Frost Exponential Damping Filter
            img_f = img.astype(np.float32)
            mean = cv2.blur(img_f, (5, 5))
            std = np.sqrt(np.maximum(0, cv2.blur(img_f**2, (5, 5)) - mean**2))
            damping = 1.0
            cx = std / (mean + 1e-5)
            weight = np.exp(-damping * cx)
            frost_out = mean * weight + img_f * (1.0 - weight)
            return np.clip(frost_out, 0, 255).astype(np.uint8)
        else:
            return img

    def process(
        self,
        raw_image: np.ndarray,
        nav_dict: Optional[Dict[str, Any]] = None,
        strict_nav: bool = False
    ) -> Dict[str, Any]:
        """
        Full End-to-End Sonar Preprocessing Pipeline.
        """
        nav = self.parse_nav_metadata(nav_dict, strict=strict_nav)
        
        # 1. Single channel intensity
        if len(raw_image.shape) == 3:
            gray = cv2.cvtColor(raw_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = raw_image.copy()

        h, w = gray.shape[:2]

        # 2. TVG & Gain normalization
        tvg_corrected = self.apply_tvg_correction(gray)

        # 3. Dropout detection & interpolation
        dropout_handled, dropouts = self.handle_ping_dropouts(tvg_corrected)
        if dropouts:
            nav["quality_flags"].append(f"PING_DROPOUTS_DETECTED_{len(dropouts)}")

        # 4. Slant-to-ground range geometric rectification (applied on wide swath waterfalls)
        if nav.get("apply_slant_correction", False) or (w > 600 and nav.get("altitude_m") is not None):
            ground_rectified, res_m = self.correct_slant_to_ground_range(
                dropout_handled,
                altitude_m=float(nav["altitude_m"]),
                slant_range_m=float(nav["slant_range_m"])
            )
        else:
            ground_rectified = dropout_handled
            res_m = self.target_resolution_m

        # 5. Speckle attenuation
        denoised = self.apply_speckle_filter(ground_rectified)

        return {
            "processed_image": denoised,
            "ground_range_resolution_m_px": res_m,
            "nav_metadata": nav,
            "dropout_count": len(dropouts),
            "original_shape": gray.shape,
            "rectified_shape": denoised.shape
        }

    def tile_waterfall(
        self,
        image: np.ndarray
    ) -> List[Dict[str, Any]]:
        """
        Splits a large sonar waterfall into overlapping tiles (1024x1024, 25% overlap) for high-resolution AI inference.
        """
        h, w = image.shape[:2]
        step = int(self.tile_size * (1.0 - self.tile_overlap_ratio))
        
        tiles = []
        y_starts = list(range(0, max(1, h - self.tile_size + 1), step))
        if not y_starts or y_starts[-1] + self.tile_size < h:
            y_starts.append(max(0, h - self.tile_size))

        x_starts = list(range(0, max(1, w - self.tile_size + 1), step))
        if not x_starts or x_starts[-1] + self.tile_size < w:
            x_starts.append(max(0, w - self.tile_size))

        tile_id = 0
        for ys in y_starts:
            for xs in x_starts:
                ye = min(h, ys + self.tile_size)
                xe = min(w, xs + self.tile_size)
                tile_crop = image[ys:ye, xs:xe]
                
                th, tw = tile_crop.shape[:2]
                if th < self.tile_size or tw < self.tile_size:
                    padded = np.zeros((self.tile_size, self.tile_size), dtype=image.dtype)
                    padded[:th, :tw] = tile_crop
                    tile_crop = padded

                tiles.append({
                    "tile_id": tile_id,
                    "crop": tile_crop,
                    "x_offset": xs,
                    "y_offset": ys,
                    "crop_w": tw,
                    "crop_h": th
                })
                tile_id += 1

        return tiles
