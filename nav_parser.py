"""
JalVedh AI - Side-Scan Sonar Navigation & Telemetry Ingestion Module
PS-57 Defense Marine Debris Intelligence

Supports:
- Generic CSV / Tabular nav logs
- JSON telemetry packets
- Simulated XTF / JSF ping header packets
- Strict validation: fails loudly with SonarMetadataError if required acoustic fields are missing.
"""

import os
import csv
import json
from typing import Dict, Any, Optional, List


class SonarMetadataError(ValueError):
    """Raised when critical sonar telemetry or acoustic geometry is missing/invalid."""
    pass


class SonarNavParser:
    REQUIRED_FIELDS = ["altitude_m", "slant_range_m"]

    @staticmethod
    def parse_dict(nav_dict: Dict[str, Any], strict: bool = False) -> Dict[str, Any]:
        """
        Parses dictionary of nav telemetry.
        If strict=True, raises SonarMetadataError if altitude or slant_range is missing.
        """
        alt = nav_dict.get("altitude_m") or nav_dict.get("alt")
        slant = nav_dict.get("slant_range_m") or nav_dict.get("range")
        heading = nav_dict.get("heading_deg") or nav_dict.get("heading", 0.0)
        lat = nav_dict.get("lat")
        lon = nav_dict.get("lon")
        freq = nav_dict.get("frequency_khz", 500.0)
        pitch = nav_dict.get("pitch_deg", 0.0)
        roll = nav_dict.get("roll_deg", 0.0)
        heave = nav_dict.get("heave_m", 0.0)

        quality_flags = []

        if alt is None:
            if strict:
                raise SonarMetadataError("Critical telemetry missing: 'altitude_m' must be provided for geometric rectification.")
            alt = 15.0
            quality_flags.append("DEFAULT_ALTITUDE_UNVERIFIED")
        else:
            alt = float(alt)
            if alt <= 0:
                raise SonarMetadataError(f"Invalid altitude {alt}m. Altitude must be > 0.")

        if slant is None:
            if strict:
                raise SonarMetadataError("Critical telemetry missing: 'slant_range_m' must be provided.")
            slant = 50.0
            quality_flags.append("DEFAULT_RANGE_UNVERIFIED")
        else:
            slant = float(slant)
            if slant <= alt:
                raise SonarMetadataError(f"Slant range ({slant}m) must be greater than altitude ({alt}m).")

        if lat is None or lon is None:
            quality_flags.append("ESTIMATED_COORDINATES")
            lat = float(lat or 15.4298)
            lon = float(lon or 73.6800)
        else:
            lat = float(lat)
            lon = float(lon)

        return {
            "altitude_m": alt,
            "slant_range_m": slant,
            "heading_deg": float(heading),
            "lat": lat,
            "lon": lon,
            "frequency_khz": float(freq),
            "pitch_deg": float(pitch),
            "roll_deg": float(roll),
            "heave_m": float(heave),
            "quality_flags": quality_flags
        }

    @staticmethod
    def parse_csv_file(csv_path: str) -> List[Dict[str, Any]]:
        """Parses a CSV nav log containing ping-by-ping telemetry."""
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Nav file not found: {csv_path}")

        records = []
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                parsed = SonarNavParser.parse_dict(row, strict=False)
                records.append(parsed)
        return records
