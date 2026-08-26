import { NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export async function GET() {
  const alerts = cpStore.getAlerts();
  return NextResponse.json(alerts);
}
