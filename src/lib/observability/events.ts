import { LiveActivityEvent } from '@/types';

export type EventCallback = (event: LiveActivityEvent) => void;

export class EventBus {
  private listeners: Set<EventCallback> = new Set();
  private recentEvents: LiveActivityEvent[] = [
    {
      id: 'ev-seed-1',
      timestamp: '10:20:12',
      virtualModelName: 'Finance Assistant',
      model: 'GPT-4.1',
      stage: 'Policy Decision',
      message: 'PII detected in response. Redacted customer email address.',
      decision: 'MODIFY',
      riskScore: 38,
      type: 'WARNING',
    },
    {
      id: 'ev-seed-2',
      timestamp: '10:18:44',
      virtualModelName: 'Engineering Copilot',
      model: 'Claude 3.7',
      stage: 'Guardrail Enforcement',
      message: 'Prompt injection attack blocked before model routing.',
      decision: 'BLOCK',
      riskScore: 88,
      type: 'DANGER',
    },
    {
      id: 'ev-seed-3',
      timestamp: '10:15:02',
      virtualModelName: 'Customer Support Bot',
      model: 'Claude 3.7',
      stage: 'Response Dispatched',
      message: 'Compliant response delivered successfully. Latency 640ms.',
      decision: 'ALLOW',
      riskScore: 12,
      type: 'SUCCESS',
    },
  ];

  subscribe(callback: EventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  emit(event: LiveActivityEvent): void {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 50) {
      this.recentEvents.pop();
    }
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('Error in event listener:', err);
      }
    });
  }

  getRecentEvents(): LiveActivityEvent[] {
    return [...this.recentEvents];
  }
}

export const eventBus = new EventBus();
