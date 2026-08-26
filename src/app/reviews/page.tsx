'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReviewCase } from '@/types';
import { UserCheck, CheckCircle2, XCircle, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

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

  const handleAction = async (id: string, status: ReviewCase['status']) => {
    setActingId(id);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, reviewer: 'Compliance Officer' }),
      });
      const updated = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      }
    } catch (err) {
      console.error('Failed to update review status', err);
    } finally {
      setActingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <AppLayout
      title="Human Review & Compliance Escalations"
      subtitle="Review queue for high-risk and policy-flagged AI interactions requiring human sign-off"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Pending Cases: <strong>{pendingCount}</strong>
          </span>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
            Escalation Threshold: Risk &gt; 70
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 p-5"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            No compliance review cases currently pending.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{rev.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rev.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : rev.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {rev.virtualModelName} • {new Date(rev.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200">
                      Risk Score: {rev.riskScore}/100
                    </span>
                    <Link
                      href={`/traces/${rev.traceId}`}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 font-semibold"
                    >
                      <span>Trace</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200 text-xs text-purple-900 font-medium">
                  Flagged Reason: <strong>{rev.reason}</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      User Prompt
                    </span>
                    <div className="font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200/80">
                      {rev.prompt}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Proposed Model Output (Held for Review)
                    </span>
                    <div className="font-mono text-slate-800 bg-white p-2.5 rounded border border-slate-200/80">
                      {rev.proposedOutput}
                    </div>
                  </div>
                </div>

                {rev.status === 'PENDING' && (
                  <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(rev.id, 'DISMISSED')}
                      disabled={actingId === rev.id}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Dismiss Case
                    </button>
                    <button
                      onClick={() => handleAction(rev.id, 'OVERRIDDEN')}
                      disabled={actingId === rev.id}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Override & Block
                    </button>
                    <button
                      onClick={() => handleAction(rev.id, 'APPROVED')}
                      disabled={actingId === rev.id}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Approve Release
                    </button>
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
