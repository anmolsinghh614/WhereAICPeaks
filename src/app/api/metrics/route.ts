import { NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  const user = userId ? cpStore.getUserById(userId) || cpStore.getActiveUser() : cpStore.getActiveUser();

  const metrics = cpStore.getDashboardMetrics(user);
  const modelUsage = cpStore.getModelUsageMetrics(user);
  const guardrailViolations = cpStore.getGuardrailMetrics(user);
  const teamUsage = cpStore.getTeamUsageMetrics(user);
  const userUsage = cpStore.getUserUsageMetrics(user);
  const activeUser = user;

  return NextResponse.json({
    metrics,
    modelUsage,
    guardrailViolations,
    teamUsage,
    userUsage,
    activeUser,
  });
}

