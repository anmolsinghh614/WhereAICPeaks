import { NextRequest, NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const model = cpStore.getVirtualModelById(params.id);
  if (!model) {
    return NextResponse.json({ error: 'Virtual model not found' }, { status: 404 });
  }
  return NextResponse.json(model);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = cpStore.updateVirtualModel(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Virtual model not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
