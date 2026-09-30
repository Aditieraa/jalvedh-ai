# JalVedh AI

JalVedh AI is a side-scan sonar analysis prototype for detecting marine debris and other underwater targets. It pairs a browser dashboard with a FastAPI inference service using YOLO model weights.

## Project layout

- `Client/` contains the static frontend: the landing page, dashboard, styling, JavaScript, and sample sonar imagery.
- `app.js` is the Express server that serves the frontend.
- `yolo_server.py` is the FastAPI backend for preprocessing, detection, validation, and georeferencing.
- `preprocess.py`, `physics_validator.py`, and related Python modules support the backend pipeline.
- `marine_debris_yolov8.pt` and `yolov8n.pt` are tracked model weights.

Training datasets and generated training runs are intentionally excluded from Git. See `.gitignore` for the full list.

## Run the frontend

Install Node.js, then run:

```powershell
npm install
npm start
```

Open `http://localhost:8000` in a browser. The dashboard is also available at `http://localhost:8000/app`.

## Run the backend

Use Python 3.10 or later. From PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn ultralytics opencv-python numpy python-multipart
uvicorn yolo_server:app --reload --port 8001
```

The health endpoint is available at `http://127.0.0.1:8001/health`.

## Environment configuration

Copy `.env.example` to `.env` only when local configuration is needed. Never commit `.env` files, tokens, credentials, private keys, datasets, or training outputs.

