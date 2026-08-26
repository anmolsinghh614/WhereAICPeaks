'use client';

import React, { useState, useEffect } from 'react';
import { TraceRecord, TraceSpan } from '@/types';
import {
  X,
  Activity,
  Clock,
  DollarSign,
  Shield,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Check,
} from 'lucide-react';

interface TraceDrawerProps {
  traceId: string | null;
  onClose: () => void;
}

export function TraceDrawer({ traceId, onClose }: TraceDrawerProps) {
  const [trace, setTrace] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSpans, setExpandedSpans] = useState<Record<string, boolean>>({});
  const [viewRawJson, setViewRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!traceId) return;

    setLoading(true);
    fetch(`/api/traces/${traceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setTrace(data);
          // Expand all by default
          const expanded: Record<string, boolean> = {};
          data.spans?.forEach((s: TraceSpan) => {
            expanded[s.id] = true;
          });
          setExpandedSpans(expanded);
        }
      })
      .catch((err) => console.error('Failed to load trace', err))
      .finally(() => setLoading(false));
  }, [traceId]);

  if (!traceId) return null;

  const toggleSpan = (id: string) => {
    setExpandedSpans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyJson = () => {
    if (!trace) return;
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold">{trace?.id || traceId}</span>
                {trace && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      trace.decision === 'ALLOW'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : trace.decision === 'MODIFY'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : trace.decision === 'BLOCK'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {trace.decision}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Live Execution Trace Waterfall</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewRawJson(!viewRawJson)}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{viewRawJson ? 'Waterfall' : 'Raw JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        {loading ? (
          <div className="flex-1 p-6 space-y-4 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-48 bg-slate-100 rounded-xl"></div>
            <div className="h-32 bg-slate-100 rounded-xl"></div>
          </div>
        ) : trace ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview Metric Bar */}
            <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Latency</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{trace.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Estimated Cost</span>
                <span className="font-mono font-bold text-slate-900 text-sm">${trace.costUsd.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Calculated Risk</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{trace.riskScore} / 100</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Tokens In / Out</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {trace.promptTokens} / {trace.completionTokens}
                </span>
              </div>
            </div>

            {viewRawJson ? (
              <div className="relative">
                <button
                  onClick={copyJson}
                  className="absolute top-3 right-3 px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-xs flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 max-h-[600px]">
                  {JSON.stringify(trace, null, 2)}
                </pre>
              </div>
            ) : (
              <>
                {/* Prompt & Completion Inspection */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Payload Inspection
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      User Prompt
                    </div>
                    <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200/80 whitespace-pre-wrap">
                      {trace.prompt}
                    </div>
                  </div>

                  {trace.originalResponse && (
                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Original Model Output (Pre-Sanitization)</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                          RAW
                        </span>
                      </div>
                      <div className="text-xs font-mono text-amber-900 bg-white/80 p-2.5 rounded border border-amber-200 whitespace-pre-wrap">
                        {trace.originalResponse}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Final Dispatched Output</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          trace.decision === 'ALLOW'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trace.decision === 'MODIFY'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trace.decision}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200/80 whitespace-pre-wrap">
                      {trace.finalResponse}
                    </div>
                  </div>
                </div>

                {/* Execution Waterfall Spans */}
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Execution Spans ({trace.spans?.length || 0})</span>
                    <span className="text-[10px] text-slate-500 font-normal font-mono">
                      Total: {trace.latencyMs}ms
                    </span>
                  </div>

                  <div className="space-y-2">
                    {trace.spans?.map((span, idx) => {
                      const isExpanded = expandedSpans[span.id];
                      let StatusIcon = CheckCircle2;
                      let statusColor = 'text-emerald-500';

                      if (span.status === 'MODIFIED' || span.status === 'WARNING') {
                        StatusIcon = AlertTriangle;
                        statusColor = 'text-amber-500';
                      } else if (span.status === 'BLOCKED' || span.status === 'FAILED') {
                        StatusIcon = XCircle;
                        statusColor = 'text-red-500';
                      }

                      return (
                        <div
                          key={span.id}
                          className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs"
                        >
                          <button
                            onClick={() => toggleSpan(span.id)}
                            className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <StatusIcon className={`w-4 h-4 ${statusColor} shrink-0`} />
                              <span className="text-xs font-semibold text-slate-800">
                                {idx + 1}. {span.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[11px] font-bold text-slate-600">
                                {span.durationMs} ms
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/60">
                              <div className="text-[10px] font-mono text-slate-500 mb-1">
                                Stage: {span.stage} | Timestamp: {span.timestamp}
                              </div>
                              <pre className="p-2 bg-slate-900 text-slate-200 font-mono text-[11px] rounded border border-slate-800 overflow-x-auto">
                                {JSON.stringify(span.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs">Trace details not found.</div>
        )}
      </div>
    </div>
  );
}
