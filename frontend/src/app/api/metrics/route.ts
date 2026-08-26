import { NextResponse } from 'next/server';
import { metricsEngine } from '@/lib/observability/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrics = metricsEngine.getDashboardMetrics();
  const modelUsage = metricsEngine.getModelUsage();
  const guardrailViolations = metricsEngine.getGuardrailViolations();

  return NextResponse.json({
    metrics,
    modelUsage,
    guardrailViolations,
  });
}
