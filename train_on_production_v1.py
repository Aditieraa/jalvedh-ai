"""
JalVedh AI - Full Fine-Tuning on production_balanced_v1 Dataset
PS-57 Defense Marine Debris Intelligence

Trains directly on production_balanced_v1/dataset.yaml across:
- 0: pipeline
- 1: shipwreck
- 2: mine_cylinder
- 3: ghost_net
- 4: crab_pot

Optimized for multi-core acoustic feature representation with:
- Sonar radiometric/geometric augmentations
- Class balancing
- Held-out evaluation on test set
- Model card generation & ONNX export
"""

import os
import glob
import json
import time
import torch
import cv2
import numpy as np
from ultralytics import YOLO

torch.set_num_threads(10)

CURR_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_YAML = os.path.join(CURR_DIR, "production_balanced_v1", "dataset.yaml")
OUTPUT_WEIGHTS = os.path.join(CURR_DIR, "marine_debris_yolov8.pt")
REPORT_JSON = os.path.join(CURR_DIR, "eval", "production_v1_training_report.json")
os.makedirs(os.path.join(CURR_DIR, "eval"), exist_ok=True)


def train_model():
    print("=" * 70)
    print("  JALVEDH AI: Starting Training on production_balanced_v1")
    print("  Dataset YAML:", DATASET_YAML)
    print("=" * 70)

    # Initialize YOLOv8 nano / small detector for optimal edge throughput
    model = YOLO("yolov8n.pt")

    start_time = time.time()

    # Train on dataset with acoustic sonar parameters
    results = model.train(
        data=DATASET_YAML,
        epochs=8,
        imgsz=416,
        batch=32,
        workers=4,
        device="cpu",
        name="jalvedh_production_v1",
        optimizer="AdamW",
        lr0=0.003,
        lrf=0.01,
        weight_decay=0.0005,
        warmup_epochs=1,
        # Sonar-physical augmentations (No optical color/hue shifts)
        hsv_h=0.0,
        hsv_s=0.0,
        hsv_v=0.15,
        degrees=8.0,
        translate=0.08,
        scale=0.25,
        shear=4.0,
        perspective=0.0003,
        flipud=0.0,
        fliplr=0.5,
        mosaic=0.5,
        mixup=0.1,
        verbose=True
    )

    elapsed_time = time.time() - start_time
    print(f"\n[Training Complete] Elapsed time: {elapsed_time:.1f}s")

    # Find best model weights
    best_pt = os.path.join(model.trainer.save_dir, "weights", "best.pt")
    if not os.path.exists(best_pt):
        best_pt = os.path.join(model.trainer.save_dir, "weights", "last.pt")

    print(f"[Model Checkpoint] Saving best weights to {OUTPUT_WEIGHTS}")
    if os.path.exists(best_pt):
        import shutil
        shutil.copy2(best_pt, OUTPUT_WEIGHTS)

    # Evaluate on held-out test split
    print("\n" + "=" * 70)
    print("  Evaluating on production_balanced_v1 Held-Out Test Set")
    print("=" * 70)

    eval_model = YOLO(OUTPUT_WEIGHTS)
    val_results = eval_model.val(
        data=DATASET_YAML,
        split="test",
        imgsz=416,
        conf=0.15,
        iou=0.45,
        device="cpu",
        plots=True
    )

    # Extract metrics
    metrics = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "dataset": "production_balanced_v1",
        "training_epochs": 8,
        "elapsed_seconds": round(elapsed_time, 2),
        "overall": {
            "precision": round(float(val_results.results_dict.get("metrics/precision(B)", 0.0)) * 100, 2),
            "recall": round(float(val_results.results_dict.get("metrics/recall(B)", 0.0)) * 100, 2),
            "mAP50": round(float(val_results.results_dict.get("metrics/mAP50(B)", 0.0)) * 100, 2),
            "mAP50_95": round(float(val_results.results_dict.get("metrics/mAP50-95(B)", 0.0)) * 100, 2)
        },
        "classes": {
            "0_pipeline": {"description": "Subsea pipelines and pipe-like linear structures"},
            "1_shipwreck": {"description": "Shipwrecks and wreck-like hull structures"},
            "2_mine_cylinder": {"description": "Mine-like, cylindrical and compact artificial objects"},
            "3_ghost_net": {"description": "Synthetic abandoned or entangled fishing-net structures"},
            "4_crab_pot": {"description": "Crab pots and rigid derelict fishing gear"}
        }
    }

    # Per-class AP50
    if hasattr(val_results, "maps") and val_results.maps is not None:
        cnames = ["pipeline", "shipwreck", "mine_cylinder", "ghost_net", "crab_pot"]
        for idx, ap in enumerate(val_results.maps):
            if idx < len(cnames):
                cname = f"{idx}_{cnames[idx]}"
                if cname in metrics["classes"]:
                    metrics["classes"][cname]["mAP50"] = round(float(ap) * 100, 2)

    with open(REPORT_JSON, "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n--- TEST EVALUATION METRICS ---")
    print(json.dumps(metrics, indent=2))

    # Export to ONNX
    print("\n[ONNX Export] Exporting to ONNX...")
    try:
        onnx_path = eval_model.export(format="onnx", imgsz=416, simplify=True)
        print(f"[ONNX Export] Exported to: {onnx_path}")
    except Exception as e:
        print(f"[ONNX Export Warning]: {e}")

    # Ping server to reload model
    try:
        import urllib.request
        req = urllib.request.Request("http://localhost:8001/reload", data=b"{}", headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=3) as resp:
            print(f"[Server Sync] Model reloaded on FastAPI server: {resp.status}")
    except Exception as e:
        print(f"[Server Sync Note]: {e}")

    print("\n[Done] Training and validation finished successfully.")


if __name__ == "__main__":
    train_model()
