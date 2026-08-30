'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReviewCase } from '@/types';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Edit3,
  Send,
  User,
} from 'lucide-react';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<ReviewCase | null>(null);
  const [editedOutput, setEditedOutput] = useState('');

  const loadReviews = () => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(data || []))
      .catch((err) => console.error('Failed to load reviews', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAction = async (id: string, status: ReviewCase['status'], customOutput?: string) => {
    setActingId(id);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          reviewer: 'Anmol Singh (Chief Risk Officer)',
          proposedOutput: customOutput,
        }),
      });
      const updated = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
        setEditingCase(null);
      }
    } catch (err) {
      console.error('Failed to update review status', err);
    } finally {
      setActingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Human-in-the-Loop (HITL) Queue
              </span>
              <span className="text-xs text-slate-500">• Real-Time Escalations</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-purple-400" />
              Human Compliance & Escalation Queue
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review queue for high-risk AI interactions held for human authorization before customer dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Pending Review: </span>
              <span className="text-purple-400 font-bold">{pendingCount} Cases</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-900/60 rounded-2xl border border-slate-800 p-5"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-900/40 rounded-2xl p-12 text-center text-xs text-slate-400 border border-slate-800">
            No compliance review cases currently pending.
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{rev.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rev.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : rev.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Virtual Model: <strong className="text-slate-200">{rev.virtualModelName}</strong> • {new Date(rev.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                      Risk Score: {rev.riskScore}/100
                    </span>
                    <Link
                      href={`/traces/${rev.traceId}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 font-semibold transition-all"
                    >
                      <span>View Trace</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Flagged Reason Box */}
                <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">Escalation Trigger: </span>
                    {rev.reason}
                  </div>
                </div>

                {/* Grid Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        User Prompt
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        Sanchay Baranwal
                      </span>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                      {rev.prompt}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Proposed AI Output (Held for Authorization)
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        HELD
                      </span>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                      {rev.proposedOutput}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {rev.status === 'PENDING' && (
                  <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleAction(rev.id, 'DISMISSED')}
                      disabled={actingId === rev.id}
                      className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
                    >
                      Dismiss Case
                    </button>
                    <button
                      onClick={() => handleAction(rev.id, 'OVERRIDDEN')}
                      disabled={actingId === rev.id}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
                    >
                      Reject & Block
                    </button>
                    <button
                      onClick={() => handleAction(rev.id, 'APPROVED')}
                      disabled={actingId === rev.id}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      Approve & Dispatch
                    </button>
                  </div>
                )}

                {rev.status !== 'PENDING' && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 font-mono">
                    <span>Decision By: <strong className="text-slate-200">{rev.reviewer || 'Anmol Singh'}</strong></span>
                    <span>Status: <strong className="text-emerald-400">{rev.status}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
