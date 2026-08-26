import { NextRequest, NextResponse } from 'next/server';
import { tracingEngine } from '@/lib/tracing/trace';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const trace = tracingEngine.getById(params.id);
  if (!trace) {
    return NextResponse.json({ error: 'Trace record not found' }, { status: 404 });
  }

  return NextResponse.json(trace);
}
