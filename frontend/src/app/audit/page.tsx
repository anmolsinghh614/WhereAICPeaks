'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileText, Shield, User, Clock } from 'lucide-react';

const AUDIT_LOGS = [
  {
    id: 'aud-1029',
    timestamp: '2026-08-26 10:20:12',
    actor: 'ControlPlane Guard Engine',
    action: 'POLICY_MODIFICATION',
    target: 'vm-finance-assistant',
    details: 'Redacted PII customer email address before dispatching to client.',
  },
  {
    id: 'aud-1028',
    timestamp: '2026-08-26 10:18:44',
    actor: 'Security Interceptor',
    action: 'REQUEST_BLOCKED',
    target: 'vm-engineering-copilot',
    details: 'Blocked prompt injection attack attempting to exfiltrate root credentials.',
  },
  {
    id: 'aud-1027',
    timestamp: '2026-08-26 09:30:00',
    actor: 'Admin (System)',
    action: 'POLICY_UPDATED',
    target: 'pol-finance-strict',
    details: 'Adjusted daily budget cap to $150.00 USD and enabled PII guardrails.',
  },
  {
    id: 'aud-1026',
    timestamp: '2026-08-26 09:00:00',
    actor: 'Admin (System)',
    action: 'VIRTUAL_MODEL_DEPLOYED',
    target: 'vm-demo-guard',
    details: 'Initialized ControlPlane Demo Endpoint for interactive evaluation.',
  },
];

export default function AuditLogsPage() {
  return (
    <AppLayout
      title="System Audit & Change Ledger"
      subtitle="Immutable cryptographic trail of administrative modifications, policy changes, and automated guardrail interventions"
    >
      <div className="space-y-4 max-w-5xl">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Administrative Audit Trail
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SOC-2 & ISO 27001 Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Event ID</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Target Resource</th>
                  <th className="py-2.5 px-4 font-sans">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-600">{log.id}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-indigo-700 font-bold">{log.target}</td>
                    <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
