# ControlPlane.ai

Enterprise AI Control Plane for Real-Time Governance, Observability, Cost Control, and Responsible AI.

```
AI APPLICATIONS / AGENTS
       ↓
 CONTROLPLANE.AI
       ↓
Performance | Cost | Responsibility
       ↓
Risk & Policy Engine
       ↓
ALLOW | MODIFY | BLOCK | ESCALATE
       ↓
   AI MODELS
```

---

## Repository Structure

```
controlplane-ai/
├── frontend/         # Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts
│   ├── src/
│   │   ├── app/      # Dashboard, Playground, Metrics, Traces, Virtual Models, Policies, Guardrails
│   │   ├── components/
│   │   ├── types/
│   │   └── lib/
│   ├── package.json
│   └── next.config.mjs
│
├── backend/          # Python FastAPI Standalone Backend Service
│   ├── main.py
│   └── requirements.txt
│
└── .gitignore        # Root Git ignore rules
```

---

## Quickstart

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Run Backend (Optional standalone)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Open **`http://localhost:8000/docs`** for interactive API documentation.
