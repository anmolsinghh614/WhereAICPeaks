'use client';

import React, { useEffect, useState } from 'react';
import { LiveActivityEvent } from '@/types';
import { Activity, ShieldCheck, AlertTriangle, XCircle, UserCheck, Radio } from 'lucide-react';

interface LiveActivityFeedProps {
  initialEvents: LiveActivityEvent[];
}

export function LiveActivityFeed({ initialEvents }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<LiveActivityEvent[]>(initialEvents || []);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initial fetch to ensure up-to-date events
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.recentEvents) setEvents(d.recentEvents);
      })
      .catch(() => {});

    // Connect to real-time Server-Sent Events stream
    const eventSource = new EventSource('/api/events');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'CONNECTED') return;

        setEvents((prev) => [data, ...prev.slice(0, 24)]);
      } catch (err) {
        console.error('Failed to parse live event SSE', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Real-Time Activity Stream
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{isConnected ? 'LIVE FEED' : 'CONNECTING'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-1">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Awaiting incoming model transactions...
          </div>
        ) : (
          events.map((ev) => {
            let Icon = ShieldCheck;
            let iconStyle = 'bg-emerald-50 text-emerald-600 border-emerald-100';

            if (ev.decision === 'MODIFY') {
              Icon = AlertTriangle;
              iconStyle = 'bg-amber-50 text-amber-600 border-amber-100';
            } else if (ev.decision === 'BLOCK') {
              Icon = XCircle;
              iconStyle = 'bg-red-50 text-red-600 border-red-100';
            } else if (ev.decision === 'ESCALATE') {
              Icon = UserCheck;
              iconStyle = 'bg-purple-50 text-purple-600 border-purple-100';
            }

            return (
              <div
                key={ev.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs flex items-start gap-2.5"
              >
                <div className={`p-1.5 rounded-md border shrink-0 mt-0.5 ${iconStyle}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-900 truncate text-[11px]">
                      {ev.virtualModelName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-tight">
                    {ev.message}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono">
                    <span className="text-slate-500">{ev.stage}</span>
                    {ev.decision && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded ${
                            ev.decision === 'ALLOW'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.decision === 'MODIFY'
                              ? 'bg-amber-100 text-amber-800'
                              : ev.decision === 'BLOCK'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {ev.decision}
                        </span>
                      </>
                    )}
                    {ev.riskScore !== undefined && (
                      <span className="text-slate-400">Risk: {ev.riskScore}/100</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
