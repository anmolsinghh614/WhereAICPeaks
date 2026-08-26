'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Zap,
} from 'lucide-react';

interface TraceDrawerProps {
  traceId: string | null;
  initialTrace?: TraceRecord | null;
  onClose: () => void;
}

export function TraceDrawer({ traceId, initialTrace, onClose }: TraceDrawerProps) {
  const [trace, setTrace] = useState<TraceRecord | null>(initialTrace || null);
  const [loading, setLoading] = useState(false);
  const [expandedSpans, setExpandedSpans] = useState<Record<string, boolean>>({});
  const [viewRawJson, setViewRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut listener for ESC key
  useEffect(() => {
    if (!traceId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [traceId, onClose]);

  useEffect(() => {
    if (!traceId) return;

    if (initialTrace && initialTrace.id === traceId) {
      setTrace(initialTrace);
    }

    setLoading(true);
    fetch(`/api/traces/${traceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setTrace(data);
        }
      })
      .catch((err) => console.error('Failed to load trace from API', err))
      .finally(() => setLoading(false));
  }, [traceId, initialTrace]);

  if (!traceId || !mounted) return null;

  const toggleSpan = (id: string) => {
    setExpandedSpans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyJson = () => {
    if (!trace) return;
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDuration = trace?.latencyMs || 1;
  const startTimestamp = trace?.spans?.[0]?.startTime || 0;

  const drawerContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden relative z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header - Sticky Pinned at Top */}
        <div className="h-16 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">{trace?.id || traceId}</span>
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
              <span className="text-[10px] text-slate-400">Execution Waterfall & Observability Ledger</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewRawJson(!viewRawJson)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{viewRawJson ? 'Waterfall' : 'Raw JSON'}</span>
            </button>

            {/* High-Visibility Close Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white transition-all cursor-pointer border border-red-500/40 font-semibold text-xs"
              title="Close Drawer (Press Esc)"
            >
              <X className="w-4 h-4 stroke-2" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable Content */}
        {loading && !trace ? (
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
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Risk Score</span>
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
                  className="absolute top-3 right-3 px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-xs flex items-center gap-1 font-mono cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 max-h-[600px]">
                  {JSON.stringify(trace, null, 2)}
                </pre>
              </div>
            ) : (
              <>
                {/* Payload Inspection */}
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

                {/* Distributed Waterfall Spans */}
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Execution Spans ({trace.spans?.length || 0})</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Total Latency: {trace.latencyMs} ms
                    </span>
                  </div>

                  {/* Timeline Scale Ruler */}
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono px-3 py-1 bg-slate-100/70 rounded-t-lg border border-b-0 border-slate-200">
                    <span>0 ms</span>
                    <span>{Math.round(totalDuration * 0.25)} ms</span>
                    <span>{Math.round(totalDuration * 0.5)} ms</span>
                    <span>{Math.round(totalDuration * 0.75)} ms</span>
                    <span>{totalDuration} ms</span>
                  </div>

                  <div className="border border-slate-200 rounded-b-lg divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
                    {trace.spans?.map((span, idx) => {
                      const isExpanded = expandedSpans[span.id];
                      let StatusIcon = CheckCircle2;
                      let statusColor = 'text-emerald-500';

                      if (span.status === 'MODIFIED' || span.status === 'WARNING') {
                        StatusIcon = AlertTriangle;
                        statusColor = 'text-amber-500';
                      } else if (span.status === 'BLOCKED' || span.status === 'FAILED' || span.status === 'VIOLATION') {
                        StatusIcon = XCircle;
                        statusColor = 'text-red-500';
                      }

                      // Calculate span start offset and duration percentage for the visual bar
                      const spanOffset = Math.max(0, (span.startTime || 0) - startTimestamp);
                      const leftPercent = Math.min(95, Math.max(0, (spanOffset / totalDuration) * 100));
                      const widthPercent = Math.min(100 - leftPercent, Math.max(3, (span.durationMs / totalDuration) * 100));

                      return (
                        <div key={span.id} className="transition-colors hover:bg-slate-50/80">
                          <button
                            onClick={() => toggleSpan(span.id)}
                            className="w-full px-3 py-2.5 flex items-center gap-3 text-left cursor-pointer"
                          >
                            {/* Left: Index & Name */}
                            <div className="flex items-center gap-2 min-w-[200px] max-w-[240px] truncate">
                              <StatusIcon className={`w-3.5 h-3.5 ${statusColor} shrink-0`} />
                              <span className="text-[11px] font-semibold text-slate-800 truncate">
                                {idx + 1}. {span.name}
                              </span>
                            </div>

                            {/* Center: Visual Timeline Waterfall Bar */}
                            <div className="flex-1 h-3 bg-slate-100 rounded-full relative overflow-hidden">
                              <div
                                className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${
                                  span.status === 'VIOLATION' || span.status === 'FAILED' || span.status === 'BLOCKED'
                                    ? 'bg-red-500'
                                    : span.status === 'MODIFIED' || span.status === 'WARNING'
                                    ? 'bg-amber-500'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                }`}
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`,
                                }}
                              />
                            </div>

                            {/* Right: Latency & Chevron */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[10px] font-bold text-slate-600 min-w-[45px] text-right">
                                {span.durationMs} ms
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {/* Expanded Span Details Card */}
                          {isExpanded && (
                            <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-100 text-xs space-y-2">
                              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-slate-400 block uppercase">Span Type</span>
                                  <span className="font-bold text-slate-800">{span.type}</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-slate-400 block uppercase">Duration</span>
                                  <span className="font-bold text-slate-800">{span.durationMs} ms ({((span.durationMs / totalDuration) * 100).toFixed(1)}%)</span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-slate-400 block uppercase">Status</span>
                                  <span className={`font-bold ${statusColor}`}>{span.status}</span>
                                </div>
                              </div>

                              <div className="p-2.5 bg-white rounded border border-slate-200 text-[11px] text-slate-600 font-sans">
                                <strong>Inspection Note:</strong> {span.name} completed successfully in {span.durationMs}ms with state <strong>{span.status}</strong>.
                              </div>
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

        {/* Sticky Footer Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 z-20">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Close Trace Drawer
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
