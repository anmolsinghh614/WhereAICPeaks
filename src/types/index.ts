export type UserRole = 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
export type DecisionState = 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type GuardrailAction = 'BLOCK' | 'MODIFY' | 'ESCALATE' | 'ALLOW';

export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  dailyBudgetLimit: number;
  spentToday: number;
  memberCount: number;
  createdAt: string;
  assignedVirtualModels?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  teamName: string;
  avatarUrl?: string;
  title?: string;
}

export interface GuardrailConfig {
  id: string;
  name: string;
  category: 'SECURITY' | 'PRIVACY' | 'CONTENT' | 'FINANCE' | 'COMPLIANCE';
  description: string;
  severity: SeverityLevel;
  action: GuardrailAction;
  enabled: boolean;
  rulesCount?: number;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  riskThreshold?: number; // e.g. 50
  riskThresholdBlock?: number;
  riskThresholdEscalate?: number;
  maxCostPerRequest?: number;
  dailyBudget?: number;
  dailyBudgetLimit?: number;
  allowedModels?: string[];
  allowedProviders?: string[];
  requiredGuardrails?: string[];
  defaultAction?: DecisionState;
  escalationThreshold?: number;
  blockThreshold?: number;
  enforcePiiRedaction?: boolean;
  blockPromptInjections?: boolean;
  escalateHighRisk?: boolean;
  enabled?: boolean;
}

export interface FoundationModel {
  id: string;
  provider: string; // OpenAI, Anthropic, Google, ControlPlane
  name: string;
  modelName?: string;
  inputTokenPrice: number; // price per 1k tokens
  outputTokenPrice: number; // price per 1k tokens
  contextWindow: number;
  avgLatencyMs?: number;
  latencyAvgMs?: number;
  status?: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
  capabilities?: string[];
  isLocalDemo?: boolean;
  enabled?: boolean;
}

export interface VirtualModel {
  id: string;
  name: string;
  description: string;
  underlyingModelId: string;
  provider: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  policyId: string;
  guardrailIds: string[];
  dailyBudget: number;
  spentToday: number;
  perRequestBudget: number;
  status?: 'ACTIVE' | 'PAUSED' | 'RATE_LIMITED';
  totalRequests: number;
  avgRisk: number;
  enabled?: boolean;
  createdAt?: string;
  teamId?: string;
  teamName?: string;
  createdByUserEmail?: string;
}

export interface TraceSpan {
  id: string;
  name: string;
  stage?: string;
  type?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'MODIFIED' | 'BLOCKED' | 'VIOLATION' | 'OK';
  durationMs: number;
  timestamp?: string;
  startTime?: number;
  endTime?: number;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface TraceRecord {
  id: string;
  timestamp: string;
  virtualModelId: string;
  virtualModelName: string;
  provider: string;
  model: string;
  prompt: string;
  originalResponse?: string;
  finalResponse: string;
  decision: DecisionState;
  decisionReason: string;
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  performanceScore: number;
  responsibilityScore: 'PASS' | 'FLAGGED' | 'VIOLATION' | 'WARNING';
  policyStatus: 'PASS' | 'MODIFIED' | 'VIOLATION' | 'ESCALATED';
  latencyMs: number;
  costUsd: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  triggeredRules: string[];
  guardrailViolations: string[];
  spans: TraceSpan[];
  userEmail?: string;
  userName?: string;
  teamId?: string;
  teamName?: string;
}

export interface LiveActivityEvent {
  id: string;
  timestamp: string;
  virtualModelName: string;
  model: string;
  stage: string;
  message: string;
  decision?: DecisionState;
  riskScore?: number;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' | 'ALERT';
  userEmail?: string;
  teamId?: string;
}

export interface DashboardMetrics {
  totalRequests: number;
  totalCost: number;
  totalTokens: number;
  avgLatencyMs: number;
  avgRiskScore: number;
  blockedCount: number;
  escalatedCount: number;
  modifiedCount: number;
  allowedCount: number;
  budgetUtilizationPct: number;
  requestsTrend: number[];
  costTrend: number[];
  riskTrend: number[];
  decisionDistribution: {
    allow: number;
    modify: number;
    block: number;
    escalate: number;
  };
}

export interface ModelUsageMetric {
  modelId: string;
  modelName: string;
  provider: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatencyMs: number;
  avgRisk: number;
}

export interface GuardrailMetric {
  guardrailId: string;
  name: string;
  violations: number;
  blockedCount: number;
  modifiedCount: number;
  lastTriggered: string;
}

export interface TeamUsageMetric {
  teamId: string;
  teamName: string;
  department: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatencyMs: number;
  avgRisk: number;
  blockedCount: number;
  violationsCount: number;
}

export interface UserUsageMetric {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  teamName: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatencyMs: number;
  avgRisk: number;
  blockedCount: number;
}

export interface ReviewCase {
  id: string;
  traceId: string;
  virtualModelName: string;
  timestamp: string;
  riskScore: number;
  reason: string;
  prompt: string;
  proposedOutput: string;
  status: 'PENDING' | 'APPROVED' | 'OVERRIDDEN' | 'DISMISSED';
  reviewer?: string;
  userEmail?: string;
  teamId?: string;
  teamName?: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  virtualModelName: string;
  isRead: boolean;
  teamId?: string;
  userEmail?: string;
}

