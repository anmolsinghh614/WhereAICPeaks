'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { TraceRecord, TraceSpan } from '@/types';
import {
  Activity,
  ArrowLeft,
  Clock,
  DollarSign,
  Shield,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Check,
  Layers,
  Cpu,
  Split,
} from 'lucide-react';
import Link from 'next/link';

export default function TraceDetailPage() {
  const params = useParams();
  const traceId = params?.id as string;

  const [trace, setTrace] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSpans, setExpandedSpans] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [viewRawJson, setViewRawJson] = useState(false);

  useEffect(() => {
    if (!traceId) return;

    fetch(`/api/traces/${traceId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setTrace(data);
          const expanded: Record<string, boolean> = {};
          data.spans?.forEach((s: TraceSpan) => {
            expanded[s.id] = true;
          });
          setExpandedSpans(expanded);
        }
      })
      .catch((err) => console.error('Failed to load trace detail', err))
      .finally(() => setLoading(false));
  }, [traceId]);

  const toggleSpan = (id: string) => {
    setExpandedSpans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyJson = () => {
    if (!trace) return;
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppLayout title="Trace Details">
        <div className="p-8 space-y-4 animate-pulse">
          <div className="h-20 bg-white rounded-xl"></div>
          <div className="h-64 bg-white rounded-xl"></div>
        </div>
      </AppLayout>
    );
  }

  if (!trace) {
    return (
      <AppLayout title="Trace Not Found">
        <div className="bg-white rounded-xl p-8 text-center text-slate-500">
          Trace {traceId} does not exist in ControlPlane.
          <div className="mt-4">
            <Link href="/traces" className="text-blue-600 font-semibold hover:underline">
              Return to Traces List
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Trace Detail: ${trace.id}`}
      subtitle={`Recorded at ${new Date(trace.timestamp).toLocaleString()} for ${trace.virtualModelName}`}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/traces"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Traces
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewRawJson(!viewRawJson)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{viewRawJson ? 'Waterfall View' : 'Raw JSON'}</span>
            </button>
            <button
              onClick={copyJson}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Primary Meta & Decision Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Decision</span>
            <span
              className={`inline-block mt-1 font-mono font-bold text-sm px-2.5 py-0.5 rounded-full ${
                trace.decision === 'ALLOW'
                  ? 'bg-emerald-100 text-emerald-800'
                  : trace.decision === 'MODIFY'
                  ? 'bg-amber-100 text-amber-800'
                  : trace.decision === 'BLOCK'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {trace.decision}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Score</span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {trace.riskScore} / 100 ({trace.riskCategory})
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Latency</span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {trace.latencyMs} ms
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Inference Cost</span>
            <div className="text-base font-extrabold text-emerald-600 font-mono mt-0.5">
              ${trace.costUsd.toFixed(5)}
            </div>
          </div>
        </div>

        {viewRawJson ? (
          <pre className="p-5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
            {JSON.stringify(trace, null, 2)}
          </pre>
        ) : (
          <>
            {/* Payload Inspection Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Payload Inspection & Governance Verdict
              </h3>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  User Ingested Prompt
                </div>
                <div className="text-xs font-mono text-slate-900 bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap">
                  {trace.prompt}
                </div>
              </div>

              {trace.originalResponse && (
                <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex justify-between">
                    <span>Original Raw Model Output (Before Sanitization)</span>
                    <span className="font-mono text-red-600">UNSAFE RAW</span>
                  </div>
                  <div className="text-xs font-mono text-amber-950 bg-white/90 p-3 rounded border border-amber-200 whitespace-pre-wrap">
                    {trace.originalResponse}
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Final Dispatched Response
                </div>
                <div className="text-xs font-mono text-slate-900 bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap">
                  {trace.finalResponse}
                </div>
              </div>
            </div>

            {/* Waterfall Execution Spans */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Execution Waterfall Spans ({trace.spans?.length || 0})
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Total Engine Time: {trace.latencyMs}ms
                </span>
              </div>

              <div className="space-y-2.5">
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
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-4 h-4 ${statusColor} shrink-0`} />
                          <span className="text-xs font-bold text-slate-800">
                            Span {idx + 1}: {span.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-bold text-slate-700">
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
                        <div className="px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50/70">
                          <div className="text-[11px] font-mono text-slate-500 mb-1.5">
                            Stage: {span.stage} | Timestamp: {span.timestamp}
                          </div>
                          <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg border border-slate-800 overflow-x-auto">
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
    </AppLayout>
  );
}
