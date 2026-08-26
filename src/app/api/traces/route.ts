import { NextRequest, NextResponse } from 'next/server';
import { tracingEngine } from '@/lib/tracing/trace';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const virtualModelId = searchParams.get('virtualModelId');
  const decision = searchParams.get('decision');
  const provider = searchParams.get('provider');

  let traces = tracingEngine.getAll();

  if (virtualModelId && virtualModelId !== 'all') {
    traces = traces.filter((t) => t.virtualModelId === virtualModelId);
  }
  if (decision && decision !== 'all') {
    traces = traces.filter((t) => t.decision === decision);
  }
  if (provider && provider !== 'all') {
    traces = traces.filter((t) => t.provider.toLowerCase() === provider.toLowerCase());
  }

  return NextResponse.json(traces);
}
