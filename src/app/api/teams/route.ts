import { NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const teams = cpStore.getTeams();
  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTeam = cpStore.createTeam({
      name: body.name,
      description: body.description || '',
      department: body.department || 'General',
      dailyBudgetLimit: body.dailyBudgetLimit || 150.0,
      assignedVirtualModels: body.assignedVirtualModels || [],
    });
    return NextResponse.json({ team: newTeam });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 400 });
  }
}
