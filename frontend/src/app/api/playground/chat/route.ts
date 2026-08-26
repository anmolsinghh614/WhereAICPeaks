import { NextRequest, NextResponse } from 'next/server';
import { executeControlPlane } from '@/lib/control-plane/pipeline';
import { z } from 'zod';

const ChatSchema = z.object({
  virtualModelId: z.string().min(1, 'virtualModelId is required'),
  prompt: z.string().min(1, 'prompt cannot be empty'),
  scenario: z.string().optional(),
  customParameters: z
    .object({
      temperature: z.number().optional(),
      maxTokens: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues.map((i) => i.message).join(', '),
          },
        },
        { status: 400 }
      );
    }

    const result = await executeControlPlane({
      virtualModelId: parsed.data.virtualModelId,
      prompt: parsed.data.prompt,
      scenario: parsed.data.scenario,
      customParameters: parsed.data.customParameters,
    });

    return NextResponse.json({
      success: true,
      data: result,
      // Direct compatibility fields
      ...result,
    });
  } catch (err: any) {
    console.error('Error executing ControlPlane pipeline:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_CONTROLPLANE_ERROR',
          message: err.message || 'An unexpected error occurred in ControlPlane pipeline',
        },
      },
      { status: 500 }
    );
  }
}
