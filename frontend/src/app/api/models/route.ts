import { NextResponse } from 'next/server';
import { modelRegistry } from '@/lib/models/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(modelRegistry.getAll());
}
