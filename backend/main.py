"""
ControlPlane.ai - Standalone Enterprise Backend Service
FastAPI REST APIs & Server-Sent Events (SSE) Engine
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import time
import json

app = FastAPI(
    title="ControlPlane.ai Backend Engine",
    description="Real-time AI governance, observability, cost control, and policy enforcement runtime",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event broadcast queue for SSE
subscribers: List[asyncio.Queue] = []

async def broadcast_event(event_data: Dict[str, Any]):
    message = json.dumps(event_data)
    for q in subscribers:
        await q.put(message)

# Data Models
class ChatRequest(BaseModel):
    virtualModelId: str
    prompt: str
    customParameters: Optional[Dict[str, Any]] = None

class VirtualModelCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    underlyingModelId: str
    provider: Optional[str] = "OpenAI"
    systemPrompt: Optional[str] = "You are an enterprise AI assistant."
    temperature: Optional[float] = 0.7
    maxTokens: Optional[int] = 1024
    policyId: str
    guardrailIds: Optional[List[str]] = []
    dailyBudget: Optional[float] = 100.0
    perRequestBudget: Optional[float] = 0.05

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ControlPlane.ai Backend Engine",
        "version": "1.0.0"
    }

@app.get("/api/dashboard")
def get_dashboard():
    return {
        "metrics": {
            "totalRequests": 4540,
            "totalCost": 148.68,
            "totalTokens": 1428000,
            "avgLatencyMs": 640,
            "avgRiskScore": 24,
            "blockedCount": 218,
            "escalatedCount": 78,
            "modifiedCount": 394,
            "allowedCount": 3850,
            "budgetUtilizationPct": 30,
            "requestsTrend": [280, 310, 295, 340, 420, 380, 490, 530, 480, 560, 610, 650],
            "costTrend": [8.5, 9.8, 9.1, 10.4, 12.2, 11.5, 14.8, 16.2, 14.9, 17.5, 18.2, 19.8],
            "riskTrend": [21, 24, 22, 28, 25, 29, 23, 27, 24, 22, 25, 24],
            "decisionDistribution": {
                "allow": 3850,
                "modify": 394,
                "block": 218,
                "escalate": 78
            }
        },
        "recentEvents": [],
        "activeVirtualModelsCount": 4
    }

@app.get("/api/events")
async def sse_events(request: Request):
    async def event_generator():
        q = asyncio.Queue()
        subscribers.append(q)
        try:
            yield {"event": "connected", "data": json.dumps({"status": "CONNECTED"})}
            while True:
                if await request.is_disconnected():
                    break
                data = await q.get()
                yield {"event": "message", "data": data}
        finally:
            subscribers.remove(q)

    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
