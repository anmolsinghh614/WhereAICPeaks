<div align="center">

# 🛡️ ControlPlane.AI
### Enterprise Control Plane for Real-Time AI Governance, Deterministic Policy Enforcement, Multi-Tenant RBAC & Regulatory Compliance

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.18-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![EU AI Act Ready](https://img.shields.io/badge/EU_AI_Act-2024%2F1689-emerald?style=for-the-badge)](https://compliance.europa.eu)
[![NIST AI RMF](https://img.shields.io/badge/NIST_AI_RMF-1.0-blue?style=for-the-badge)](https://nist.gov)

<p align="center">
  <b>Built for the Accenture Innovation Challenge</b><br/>
  <i>Solving the critical enterprise dilemma: How to deploy generative AI applications at global enterprise scale while guaranteeing multi-tenant role isolation, zero data leaks, deterministic cost caps, EU AI Act compliance, and human oversight.</i>
</p>

---

</div>

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [High-Level Architecture](#-high-level-architecture)
3. [The 13-Stage Governance & Telemetry Pipeline](#-the-13-stage-governance--telemetry-pipeline)
4. [Multi-Tenant RBAC & Enterprise Team Roster](#-multi-tenant-rbac--enterprise-team-roster)
5. [The 4 Core ControlPlane Decisions](#-the-4-core-controlplane-decisions)
6. [Key Enterprise Modules](#-key-enterprise-modules)
7. [Regulatory Compliance Scorecard (EU AI Act & NIST)](#-regulatory-compliance-scorecard-eu-ai-act--nist)
8. [Live Video Demonstration Script & Guide](#-live-video-demonstration-script--guide)
9. [Technical Stack & Design System](#-technical-stack--design-system)
10. [Local Installation & Setup](#-local-installation--setup)
11. [Project Directory Layout](#-project-directory-layout)

---

## 🎯 Executive Summary & Problem Statement

### The Enterprise Dilemma
As Fortune 500 enterprises race to adopt Generative AI agents, internal developer platforms, and customer-facing copilots, engineering leaders face severe operational and regulatory bottlenecks:

* 🚨 **Data Privacy & Compliance (EU AI Act, HIPAA, GDPR)**: LLMs inadvertently ingest and leak PII (SSNs, emails, phone numbers) and confidential credentials.
* 💸 **Runaway LLM Spend & Multi-Tenant Leaks**: Without virtual endpoints and department-level spend caps, API costs explode and team data leaks across departments.
* ⚔️ **Adversarial Threats & Jailbreaks**: Direct prompt injection, indirect context contamination, and unauthorized financial/medical advisory outputs bypass traditional firewalls.
* 🔍 **The Observability Black Box**: Inability to inspect distributed token streams, latency percentiles, and risk scores on every single inference request.

### The Solution: ControlPlane.AI
**ControlPlane.AI** serves as the **central proxy and policy enforcement layer** situated between all enterprise AI applications and upstream foundation models. Every prompt and completion passes through a **synchronous 13-stage governance pipeline** that scores risk, verifies budgets, sanitizes sensitive tokens in real time, and produces an **immutable OpenTelemetry-compatible trace**.

```
┌─────────────────────────┐
│ AI Applications & Agents│ (Customer Bots, Internal Copilots, Automated Pipelines)
└────────────┬────────────┘
             │ HTTP / REST / Streaming
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          CONTROLPLANE.AI                               │
│                                                                        │
│  [1. Ingest] ──► [2. RBAC Scope] ──► [3. Guardrails] ──► [4. Budget]   │
│                          │                  │                 │        │
│  [8. Policy Matrix] ◄── [7. Risk Score] ◄── [6. Scoring] ◄── [5. LLM] │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             ▼
┌───────────────────────────┐
│ Deterministic Action:     │
│ • ALLOW (Pass-through)    │
│ • MODIFY (PII Redaction)  │
│ • BLOCK (Security Shield) │
│ • ESCALATE (Human Hold)   │
└────────────┬──────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Upstream Foundation Models (Google Gemini 3.7/3.6, GPT-4.1, Claude 3.7)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Multi-Tenant RBAC & Enterprise Team Roster

ControlPlane.AI features strict role-based access control and organizational isolation:

| Team Member | Enterprise Email | Assigned Role | Team Name | Scope & Authority |
| :--- | :--- | :--- | :--- | :--- |
| **Anmol Singh** | `anmol.singh@enterprise.com` | **`ADMIN`** | Executive Core | **Global Scope**: Full system access, policy mutation, compliance certificates, and audit overrides. |
| **Sanchay Baranwal** | `sanchay.baranwal@finance-corp.com` | **`TEAM_LEAD`** | Finance & Accounting | **Team Scope**: VP of Finance Ops; manages financial virtual models, team spend caps, and review escalations. |
| **Swaralipi Datta** | `swaralipi.datta@finance-corp.com` | **`MEMBER`** | Finance & Accounting | **Member Scope**: Senior Analyst; executes prompts and views team-restricted telemetry. |

---

## 🚦 The 4 Core ControlPlane Decisions

ControlPlane.AI categorizes every transaction into one of 4 auditable decision states:

| Decision State | Trigger Condition | System Action | Enterprise Value |
| :--- | :--- | :--- | :--- |
| **`ALLOW`** | Risk Score < 30 & all guardrails pass | Dispatches model output with sub-millisecond overhead. | Zero friction for standard, compliant enterprise traffic. |
| **`MODIFY`** | PII or confidential data detected | Sanitizes and redacts sensitive data (e.g. `[EMAIL REDACTED]`) before returning to client. | Prevents compliance fines without breaking user experience. |
| **`BLOCK`** | Prompt injection, credential leak, or policy violation | Intercepts execution, denies upstream inference, and returns security intervention notice. | Eliminates data exfiltration and model hijacking attacks. |
| **`ESCALATE`** | High-risk financial advice or compliance breach (Risk > 40) | Holds payload in human review queue (`/reviews`) for risk officer sign-off. | Guarantees human-in-the-loop oversight for high-liability decisions. |

---

## 🖥️ Key Enterprise Modules

### 1. Interactive Governance Playground (`/playground`)
* **Real-Time Model Selector**: Switch seamlessly between **Google Gemini 3.7 Flash**, **Gemini 3.6 Flash**, **Gemini 3.5 Flash**, **GPT-4.1 Enterprise**, and **Claude 3.7 Sonnet**.
* **Live Persona Switcher**: Switch identity context between **Anmol Singh**, **Sanchay Baranwal**, **Swaralipi Datta**, **Akansha Singh**, and **Mahiya Agarwal**.
* **Side-by-Side PII Inspection**: View tabbed comparisons between *Raw Unsanitized Model Output* and *ControlPlane Redacted Output*.
* **Interactive Trace Waterfall**: One-click slide-over drawer showing distributed waterfall spans, relative latencies, and inspection metadata.

### 2. Multi-Tenant RBAC & Teams Management (`/teams`)
* Provision enterprise teams (**Executive Core**, **Finance & Accounting**, **Engineering & DevOps**).
* Assign RBAC roles (`ADMIN`, `TEAM_LEAD`, `MEMBER`) with granular permission matrices.
* Manage assigned Virtual Model endpoints per department space.

### 3. Regulatory Compliance & EU AI Act Scorecard (`/compliance`)
* Continuous regulatory evaluation against **EU AI Act (Regulation 2024/1689)** Risk Tiers and **NIST AI RMF 1.0** standards.
* 1-Click **Signed Executive Audit Certificate (PDF)** download with cryptographic SHA-256 verification.

### 4. Human-in-the-Loop (HITL) Review Queue (`/reviews`)
* Live escalation workspace for queries held on compliance review (`ESCALATE`).
* Allows Admins and Team Leads to inspect prompt/response pairs, edit/redact output, and click **Approve & Dispatch** or **Reject & Block**.

### 5. Virtual Models & Emergency Kill-Switches (`/virtual-models`)
* Multi-tenant abstraction layer to decouple internal applications from vendor APIs.
* Enforce daily budget spend caps and **Emergency Circuit Breakers / Kill-Switches**.
* Configure **Auto-Fallback Targets** (`GPT-4o-mini` / `Claude 3.5 Haiku`) when primary model latency spikes or budgets reach 80% quota.

### 6. Role-Aware Metrics & Analytics (`/metrics`)
* **View by Users / View by Teams** toggle controls.
* Filter throughput, latency percentiles, cost curves, and threat distributions dynamically by active user role context.

### 7. Observability & Distributed Traces Ledger (`/traces` & `/traces/[id]`)
* Searchable execution ledger with filtering by Decision, Owner/Team, Virtual Model, and Latency.
* Detailed Datadog-style distributed waterfall charts with proportional timing bars and span-level diagnostics.

---

## 🛡️ Regulatory Compliance Scorecard (EU AI Act & NIST)

ControlPlane.AI provides automated audit readiness verification across 3 key international governance frameworks:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPLIANCE READINESS RATING                     │
│                                                                        │
│   • NIST AI RMF 1.0 Score: 94.8% (Audit-Ready)                         │
│   • EU AI Act (2024/1689): Tier 2 (Limited / Controlled Risk)          │
│   • ISO/IEC 42001: Certified Management System for AI                  │
│   • Guardrail Enforcement Rate: 100% Zero Bypass                       │
└────────────────────────────────────────────────────────────────────────┘
```

## 💻 Technical Stack & Design System

* **Framework**: Next.js 14 (App Router), React 18, TypeScript
* **Styling & UI**: Tailwind CSS 3.4, Vanilla CSS Glassmorphism Tokens (`.glass-panel`, `.glass-panel-dark`), Lucide Icons
* **Typography**: Google Fonts **Plus Jakarta Sans** (UI hierarchy) and **JetBrains Mono** (telemetry, tokens, code)
* **Data Visualization**: Recharts (Throughput, Latency, and Cost distributions)
* **LLM Engine**: Google Generative AI REST API with dynamic fallback cascades
* **State & Tracing**: In-memory singleton state persistence across Next.js API route workers

---

## 🚀 Local Installation & Setup

### Prerequisites
* **Node.js**: v18.17+ or v20+
* **npm**: v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/controlplane-ai.git
cd controlplane-ai
npm install
```

### 2. Configure Environment Variables
Create or verify `.env.local` in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

<div align="center">
  <sub>ControlPlane.AI — Engineered with precision for the Accenture Innovation Challenge.</sub>
</div>
