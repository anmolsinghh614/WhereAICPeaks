import { NextResponse } from 'next/server';
import { metricsEngine } from '@/lib/observability/metrics';
import { eventBus } from '@/lib/observability/events';
import { virtualModelManager } from '@/lib/models/virtual-models';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrics = metricsEngine.getDashboardMetrics();
  const recentEvents = eventBus.getRecentEvents();
  const activeVirtualModelsCount = virtualModelManager.getAll().filter((vm) => vm.enabled).length;

  return NextResponse.json({
    metrics,
    recentEvents,
    activeVirtualModelsCount,
  });
}
