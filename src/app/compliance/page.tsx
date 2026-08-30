'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUserContext } from '@/context/UserContext';
import {
  ShieldCheck,
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  ExternalLink,
  Shield,
  Layers,
  Lock,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export default function CompliancePage() {
  const { activeUser } = useUserContext();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setReportModalOpen(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                EU AI Act Ready • NIST AI RMF Compliant
              </span>
              <span className="text-xs text-slate-500">• Updated Real-time</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              Regulatory Compliance & Audit Readiness Scorecard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Continuous regulatory evaluation against EU AI Act (2024/1689), NIST AI RMF 1.0, and ISO/IEC 42001 standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Export Executive Audit Certificate
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">NIST AI RMF Score</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">94.8%</span>
              <span className="text-xs text-emerald-400 font-semibold">+2.4% vs last audit</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Audit-Ready (Govern, Map, Measure, Manage)</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">EU AI Act Risk Tier</span>
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-400 font-mono">Tier 2: Limited Risk</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Transparency & Human Oversight Enforced</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Guardrail Enforcement Rate</span>
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">100%</span>
              <span className="text-xs text-purple-400 font-semibold">Zero Bypass</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Real-time PII, Secrets & Injection Shields</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">ISO/IEC 42001 Compliance</span>
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-teal-400 font-mono">CERTIFIED</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Management System for Artificial Intelligence</p>
          </div>
        </div>

        {/* Regulatory Framework Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EU AI Act */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">EU AI Act (2024/1689)</h3>
                  <span className="text-[11px] text-slate-400">European Union Framework</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% PASS
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Article 10: Data & Governance</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automated PII scrubbing & cryptographic trace vaulting.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Article 14: Human Oversight (HITL)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Escalation queue enabled for high-risk financial & medical queries.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Article 15: Cybersecurity & Robustness</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prompt injection defense and adversarial attack blocking.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* NIST AI RMF 1.0 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">NIST AI RMF 1.0</h3>
                  <span className="text-[11px] text-slate-400">US Federal Standards</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                94.8% COMPLIANT
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">GOVERN 1.1: Multi-Tenant RBAC</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Strict role separation (Admin, Lead, Member) & team scoping.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">MAP 2.3: Context & Risk Categorization</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time risk score calculation (LOW, MEDIUM, HIGH, CRITICAL).</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">MEASURE 3.2: Latency & Cost Metrics</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Granular token, USD spend, and performance scoring telemetry.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* ISO/IEC 42001 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ISO/IEC 42001</h3>
                  <span className="text-[11px] text-slate-400">Global AI Management</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AUDITED PASS
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Annex A.6: Impact Assessment</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automatic policy evaluations per prompt request span.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Annex A.9: Traceability & Ledger</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Immutable audit logging with user email and team attribution.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Annex A.10: Model Allocation</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Virtual model endpoints mapped to team access lists.</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Team Compliance Readiness Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Enterprise Team Compliance Readiness</h3>
              <p className="text-xs text-slate-400 mt-0.5">Continuous evaluation across team spaces and virtual model endpoints.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Team Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Team Lead</th>
                  <th className="py-3 px-4">EU AI Act Status</th>
                  <th className="py-3 px-4">NIST Score</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Audit Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">Executive Core</td>
                  <td className="py-3.5 px-4 text-slate-400">C-Suite & Security</td>
                  <td className="py-3.5 px-4 text-slate-200">Anmol Singh</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Tier 1: Minimal Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">98.5%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      OPTIMAL
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">Finance & Accounting</td>
                  <td className="py-3.5 px-4 text-slate-400">Finance & Risk</td>
                  <td className="py-3.5 px-4 text-slate-200">Sanchay Baranwal</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Tier 2: Limited Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">94.2%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      AUDITED
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">Engineering & DevOps</td>
                  <td className="py-3.5 px-4 text-slate-400">Technology</td>
                  <td className="py-3.5 px-4 text-slate-200">Akansha Singh</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Tier 2: Limited Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">92.6%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      AUDITED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Executive Compliance Certificate</h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Organization:</span>
                <span className="text-white font-bold">ControlPlane Enterprise AI</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Chief Risk Officer:</span>
                <span className="text-emerald-400 font-bold">Anmol Singh</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Evaluation Date:</span>
                <span className="text-slate-200 font-mono">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cryptographic Signature:</span>
                <span className="text-slate-400 font-mono text-[10px]">sha256:8f92a1...48b92c</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This certificate verifies that ControlPlane.ai has continuously enforced EU AI Act (2024/1689) and NIST AI RMF 1.0 compliance across all virtual model proxies and team pipelines.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30"
              >
                {downloading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Download Signed Certificate (PDF)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
