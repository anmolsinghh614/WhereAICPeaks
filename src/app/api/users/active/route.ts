import { NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = cpStore.getActiveUser();
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const user = cpStore.setActiveUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 44 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid user switch payload' }, { status: 400 });
  }
}
