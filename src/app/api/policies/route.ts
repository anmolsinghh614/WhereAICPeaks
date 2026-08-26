import { NextRequest, NextResponse } from 'next/server';
import { policyEngine, SEEDED_POLICIES } from '@/lib/policy/engine';
import { z } from 'zod';

const PolicySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().default(''),
  riskThresholdBlock: z.number().min(0).max(100).default(60),
  riskThresholdEscalate: z.number().min(0).max(100).default(40),
  dailyBudgetLimit: z.number().min(1).default(100.0),
  allowedProviders: z.array(z.string()).default(['OpenAI', 'Anthropic', 'ControlPlane']),
  enforcePiiRedaction: z.boolean().default(true),
  blockPromptInjections: z.boolean().default(true),
  escalateHighRisk: z.boolean().default(true),
});

export async function GET() {
  return NextResponse.json(policyEngine.getAll());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PolicySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues.map((i) => i.message).join(', ') } },
        { status: 400 }
      );
    }

    const id = `pol-${Date.now().toString(36)}`;
    const newPolicy = {
      id,
      ...parsed.data,
      enabled: true,
    };

    SEEDED_POLICIES.push(newPolicy as any);
    return NextResponse.json({ success: true, data: newPolicy });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
