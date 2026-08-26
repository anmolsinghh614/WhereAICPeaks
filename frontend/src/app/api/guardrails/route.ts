import { NextRequest, NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export async function GET() {
  const guardrails = cpStore.getGuardrails();
  return NextResponse.json(guardrails);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Guardrail ID required' }, { status: 400 });
    }
    const updated = cpStore.toggleGuardrail(id);
    if (!updated) {
      return NextResponse.json({ error: 'Guardrail not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
