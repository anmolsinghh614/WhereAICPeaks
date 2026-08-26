import { NextRequest, NextResponse } from 'next/server';
import { virtualModelManager } from '@/lib/models/virtual-models';
import { z } from 'zod';

const VirtualModelSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().default(''),
  underlyingModelId: z.string().min(1, 'underlyingModelId is required'),
  provider: z.string().optional().default('OpenAI'),
  systemPrompt: z.string().optional().default('You are an enterprise AI assistant.'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(1).max(32000).optional().default(1024),
  policyId: z.string().min(1, 'policyId is required'),
  guardrailIds: z.array(z.string()).optional().default([]),
  dailyBudget: z.number().min(1).optional().default(100.0),
  perRequestBudget: z.number().min(0.001).optional().default(0.05),
});

export async function GET() {
  return NextResponse.json(virtualModelManager.getAll());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VirtualModelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues.map((i) => i.message).join(', ') } },
        { status: 400 }
      );
    }

    const id = `vm-${Date.now().toString(36)}`;
    const created = virtualModelManager.create({
      id,
      ...parsed.data,
      spentToday: 0.0,
      totalRequests: 0,
      avgRisk: 10,
      enabled: true,
    } as any);

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
