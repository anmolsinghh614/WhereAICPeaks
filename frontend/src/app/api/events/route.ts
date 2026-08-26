import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/observability/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: 'CONNECTED', timestamp: new Date().toLocaleTimeString() })}\n\n`)
      );

      // Subscribe to internal ControlPlane events
      const unsubscribe = eventBus.subscribe((event) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (err) {
          console.error('Error streaming SSE event:', err);
        }
      });

      // Cleanup on client disconnect
      req.signal.addEventListener('abort', () => {
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
