import { NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const users = cpStore.getUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = cpStore.createUser({
      name: body.name,
      email: body.email,
      role: body.role || 'MEMBER',
      teamId: body.teamId,
      teamName: body.teamName,
      title: body.title || 'Enterprise Operator',
    });
    return NextResponse.json({ user: newUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  }
}
