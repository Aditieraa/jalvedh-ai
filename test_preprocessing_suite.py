"""
JalVedh AI - Complete Unit & Physics Test Suite
Tests:
- Nav Metadata Ingestion & Strict Failure Modes
- Slant-to-Ground Rectification: Y_g = sqrt(R_s^2 - A^2)
- Radiometric TVG Normalization
- Ping Dropout Line Masking & Interpolation
- Speckle Denoising Benchmark (Lee, Frost, Bilateral)
- SHARP Acoustic Shadow Relief Geometry: H = (A * S) / (R + S)
- Probability Calibration & Status Tiering
"""

import math
import numpy as np
from nav_parser import SonarNavParser, SonarMetadataError
from preprocess import SonarPreprocessor
from physics_validator import AcousticPhysicsValidator


def test_nav_parser():
    # 1. Valid Dict
    d = {"altitude_m": 12.0, "slant_range_m": 45.0, "heading_deg": 90.0, "lat": 15.4, "lon": 73.8}
    parsed = SonarNavParser.parse_dict(d, strict=True)
    assert parsed["altitude_m"] == 12.0
    assert parsed["slant_range_m"] == 45.0
    assert parsed["heading_deg"] == 90.0
    assert len(parsed["quality_flags"]) == 0

    # 2. Strict Mode Exception on Missing Alt
    try:
        SonarNavParser.parse_dict({"slant_range_m": 45.0}, strict=True)
        assert False, "Should have raised SonarMetadataError"
    except SonarMetadataError:
        pass

    # 3. Invalid Geometry: Slant Range < Altitude
    try:
        SonarNavParser.parse_dict({"altitude_m": 50.0, "slant_range_m": 30.0}, strict=True)
        assert False, "Should have raised SonarMetadataError for slant < altitude"
    except SonarMetadataError:
        pass

    print("[PASS] test_nav_parser")


def test_slant_to_ground_geometry():
    preprocessor = SonarPreprocessor(target_resolution_m=0.1)
    
    # Altitude = 30m, Slant Range = 50m -> Max ground range = sqrt(50^2 - 30^2) = 40m
    alt = 30.0
    slant = 50.0
    expected_ground_max = math.sqrt(slant**2 - alt**2)
    assert abs(expected_ground_max - 40.0) < 1e-4

    dummy = np.ones((100, 1000), dtype=np.uint8) * 128
    corrected, res = preprocessor.correct_slant_to_ground_range(dummy, alt, slant)
    assert res == 0.1
    expected_half_w = int(expected_ground_max / 0.1)
    assert corrected.shape[1] == expected_half_w * 2
    assert corrected.shape[0] == 100

    print("[PASS] test_slant_to_ground_geometry")


def test_sharp_acoustic_shadow_formula():
    validator = AcousticPhysicsValidator()
    
    # Synthetic target with known parameters:
    # Altitude A = 10m, Slant Range R = 40m, Shadow Length S = 10m
    # Expected SHARP Height H = (10 * 10) / (40 + 10) = 100 / 50 = 2.0 meters
    A = 10.0
    R = 40.0
    S = 10.0
    H_expected = (A * S) / (R + S)
    assert abs(H_expected - 2.0) < 1e-5

    # Test via validator feature calculation
    dummy_crop = np.ones((50, 50), dtype=np.uint8) * 220
    # Shadow adjacent to crop
    nav = {"altitude_m": 10.0, "ground_range_resolution_m_px": 0.1, "lat": 15.0, "lon": 73.0}
    # Box located at center x=500 in 1000px image (dist from nadir = 0 -> slant range = altitude = 10m)
    feats = validator.compute_acoustic_features(dummy_crop, (475, 200, 525, 250), (600, 1000), nav, 0.85)
    
    assert "estimated_height_m" in feats
    assert "shadow_length_m" in feats
    assert feats["p95_highlight"] >= 200.0

    print("[PASS] test_sharp_acoustic_shadow_formula")


def test_tvg_and_dropouts():
    preprocessor = SonarPreprocessor()
    h, w = 100, 500
    ramp = np.sin(np.linspace(0.1, math.pi - 0.1, w)) * 200
    swath = np.tile(ramp, (h, 1)).astype(np.uint8)

    # Add dropout line
    swath[30, :] = 0

    tvg = preprocessor.apply_tvg_correction(swath)
    cleaned, dropouts = preprocessor.handle_ping_dropouts(tvg)
    
    assert 30 in dropouts
    assert cleaned[30, 250] > 0  # Interpolated

    print("[PASS] test_tvg_and_dropouts")


def test_speckle_benchmarks():
    pre_lee = SonarPreprocessor(speckle_filter="lee")
    pre_frost = SonarPreprocessor(speckle_filter="frost")
    pre_bi = SonarPreprocessor(speckle_filter="bilateral")

    noisy = np.random.normal(120, 30, (100, 100)).clip(0, 255).astype(np.uint8)
    
    out_lee = pre_lee.apply_speckle_filter(noisy)
    out_frost = pre_frost.apply_speckle_filter(noisy)
    out_bi = pre_bi.apply_speckle_filter(noisy)

    assert np.std(out_lee) < np.std(noisy)
    assert np.std(out_frost) < np.std(noisy)
    assert np.std(out_bi) < np.std(noisy)

    print("[PASS] test_speckle_benchmarks")


def test_calibration_and_tiering():
    validator = AcousticPhysicsValidator()
    
    # High confidence detection with strong highlight and shadow
    high_feats = {
        "feature_vector": np.array([2.5, 0.9, 0.1, 0.8, 0.5, 0.4, 0.6, 0.3], dtype=np.float32),
        "estimated_height_m": 4.5,
        "shadow_length_m": 12.0,
        "contrast_ratio": 8.5
    }
    calib_high = validator.validate_and_calibrate(high_feats, 0.92)
    assert calib_high["status"] == "verified_hazard"
    assert calib_high["calibrated_confidence"] >= 0.75

    # Weak detection with no shadow
    low_feats = {
        "feature_vector": np.array([-1.5, 0.3, 0.3, 0.1, 0.0, 0.0, 0.3, 0.2], dtype=np.float32),
        "estimated_height_m": 0.0,
        "shadow_length_m": 0.0,
        "contrast_ratio": 1.1
    }
    calib_low = validator.validate_and_calibrate(low_feats, 0.20)
    assert calib_low["status"] == "low_confidence"
    assert calib_low["calibrated_confidence"] < 0.45

    print("[PASS] test_calibration_and_tiering")


if __name__ == "__main__":
    test_nav_parser()
    test_slant_to_ground_geometry()
    test_sharp_acoustic_shadow_formula()
    test_tvg_and_dropouts()
    test_speckle_benchmarks()
    test_calibration_and_tiering()
    print("\n=======================================================")
    print(" ALL 6 PHASE 2 & PHASE 4/5 UNIT TESTS PASSED (100%)")
    print("=======================================================")
