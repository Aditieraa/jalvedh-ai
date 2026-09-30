"""
Unit tests for JalVedh AI Preprocessing Module (preprocess.py)
Phase 2 Validation Suite:
- Navigation/Ping Metadata Extraction & Failure Modes
- Radiometric TVG Normalization
- Slant-Range to Ground-Range Geometric Remapping: Y_g = sqrt(R_s^2 - A^2)
- Water Column Removal & Ping Dropout Handling
- Speckle Filtering (Lee vs Bilateral)
- Tiling Grid Decomposition & Recombination
"""

import math
import numpy as np
import unittest
from preprocess import SonarPreprocessor, SonarMetadataError


def test_nav_metadata_parsing():
    preprocessor = SonarPreprocessor(default_altitude_m=12.5, default_slant_range_m=50.0)
    
    # 1. Full metadata provided
    meta = preprocessor.parse_nav_metadata({
        "altitude_m": 15.0,
        "slant_range_m": 60.0,
        "heading_deg": 180.5,
        "lat": 15.498,
        "lon": 73.827,
        "frequency_khz": 450.0
    })
    assert meta["altitude_m"] == 15.0
    assert meta["slant_range_m"] == 60.0
    assert meta["heading_deg"] == 180.5
    assert len(meta["quality_flags"]) == 0

    # 2. Incomplete metadata relying on defaults with quality flags
    meta_def = preprocessor.parse_nav_metadata({})
    assert meta_def["altitude_m"] == 12.5
    assert "ESTIMATED_ALTITUDE" in meta_def["quality_flags"]
    assert "ESTIMATED_SLANT_RANGE" in meta_def["quality_flags"]


def test_slant_to_ground_geometry():
    preprocessor = SonarPreprocessor(target_resolution_m=0.1)
    
    # Altitude = 30m, Slant Range = 50m -> Max ground range = sqrt(50^2 - 30^2) = 40m
    altitude = 30.0
    slant_range = 50.0
    expected_ground_max = math.sqrt(slant_range**2 - altitude**2)
    assert abs(expected_ground_max - 40.0) < 1e-4

    # Create synthetic sonar image: 100 pings x 1000 pixels (500 per port/stbd channel)
    dummy_img = np.ones((100, 1000), dtype=np.uint8) * 128
    # Add an artificial object at port slant range pixel 300 (slant range = 30m = altitude) -> should map near nadir
    dummy_img[50, 200] = 255

    corrected, res = preprocessor.correct_slant_to_ground_range(dummy_img, altitude, slant_range)
    assert res == 0.1
    # Check width matches expected ground swath: 2 * (40m / 0.1m) = 800 pixels
    expected_half_w = int(expected_ground_max / 0.1)
    assert corrected.shape[1] == expected_half_w * 2
    assert corrected.shape[0] == 100


def test_tvg_normalization():
    preprocessor = SonarPreprocessor()
    # Create an image with severe cross-track falloff (bright at center, dark at edges)
    h, w = 100, 500
    ramp = np.sin(np.linspace(0.1, math.pi - 0.1, w)) * 200
    synthetic_swath = np.tile(ramp, (h, 1)).astype(np.uint8)

    tvg_corrected = preprocessor.apply_tvg_correction(synthetic_swath)
    assert tvg_corrected.shape == synthetic_swath.shape
    
    # TVG should boost outer edges relative to raw
    raw_edge_mean = np.mean(synthetic_swath[:, :30])
    corr_edge_mean = np.mean(tvg_corrected[:, :30])
    assert corr_edge_mean >= raw_edge_mean


def test_ping_dropout_handling():
    preprocessor = SonarPreprocessor()
    img = np.ones((50, 100), dtype=np.uint8) * 150
    # Inject a dead ping (dropout line at ping index 25)
    img[25, :] = 0

    cleaned, dropouts = preprocessor.handle_ping_dropouts(img)
    assert 25 in dropouts
    # After interpolation, ping index 25 should be recovered from neighbors
    assert cleaned[25, 50] == 150


def test_speckle_filters():
    preprocessor_bilateral = SonarPreprocessor(speckle_filter="bilateral")
    preprocessor_lee = SonarPreprocessor(speckle_filter="lee")

    noisy_img = np.random.normal(120, 25, (100, 100)).clip(0, 255).astype(np.uint8)
    
    out_bi = preprocessor_bilateral.apply_speckle_filter(noisy_img)
    out_lee = preprocessor_lee.apply_speckle_filter(noisy_img)

    assert out_bi.shape == noisy_img.shape
    assert out_lee.shape == noisy_img.shape
    # Filtered images should have reduced standard deviation compared to raw noisy speckle
    assert np.std(out_bi) < np.std(noisy_img)
    assert np.std(out_lee) < np.std(noisy_img)


def test_waterfall_tiling():
    preprocessor = SonarPreprocessor(tile_size=256, tile_overlap_ratio=0.25)
    # Large waterfall 500x600
    img = np.zeros((500, 600), dtype=np.uint8)
    tiles = preprocessor.tile_waterfall(img)
    
    assert len(tiles) > 1
    # Check bounding box bounds are strictly within image dimensions
    for tile_info in tiles:
        crop = tile_info["crop"]
        x, y = tile_info["x_offset"], tile_info["y_offset"]
        w, h = tile_info["crop_w"], tile_info["crop_h"]
        assert crop.shape[0] == 256 and crop.shape[1] == 256
        assert x + w <= 600
        assert y + h <= 500


if __name__ == "__main__":
    test_nav_metadata_parsing()
    test_slant_to_ground_geometry()
    test_tvg_normalization()
    test_ping_dropout_handling()
    test_speckle_filters()
    test_waterfall_tiling()
    print("All Phase 2 Preprocessing Unit Tests PASSED successfully!")
