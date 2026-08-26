import { NextRequest, NextResponse } from 'next/server';
import { cpStore } from '@/lib/store';

export async function GET() {
  const reviews = cpStore.getReviews();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, reviewer } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Review ID and status required' }, { status: 400 });
    }
    const updated = cpStore.updateReviewStatus(id, status, reviewer);
    if (!updated) {
      return NextResponse.json({ error: 'Review case not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
