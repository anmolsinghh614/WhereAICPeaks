# ControlPlane.ai Backend Service

Standalone FastAPI backend runtime for real-time AI governance, policy execution, and live event broadcasting.

## Quickstart

### 1. Install Dependencies
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
uvicorn main:app --reload --port 8000
```

The backend server runs on `http://localhost:8000`.

### 3. API Documentation
Once running, open the interactive Swagger docs at:
- **`http://localhost:8000/docs`**
- **`http://localhost:8000/redoc`**
