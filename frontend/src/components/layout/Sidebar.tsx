'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Play,
  Layers,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Activity,
  BarChart3,
  UserCheck,
  Bell,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Playground', href: '/playground', icon: Play, isPrimary: true },
  { label: 'Virtual Models', href: '/virtual-models', icon: Layers },
  { label: 'Models', href: '/models', icon: Cpu },
  { label: 'Policies', href: '/policies', icon: ShieldCheck },
  { label: 'Guardrails', href: '/guardrails', icon: ShieldAlert },
  { label: 'Traces', href: '/traces', icon: Activity },
  { label: 'Metrics', href: '/metrics', icon: BarChart3 },
];

const secondaryNavItems = [
  { label: 'Human Review', href: '/reviews', icon: UserCheck, badge: '1' },
  { label: 'Alerts', href: '/alerts', icon: Bell, badge: '2' },
  { label: 'Audit Logs', href: '/audit', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-cp-navy-950 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-mono font-bold text-sm tracking-wider">
          CP
        </div>
        <div>
          <div className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
            CONTROLPLANE<span className="text-blue-400 font-mono text-xs">.AI</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            AI Governance & Ops
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Core Engine
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.isPrimary && !isActive && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      Live
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Governance & Ops
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ControlPlane Real-Time Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-slate-800/40 border border-slate-700/40 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">ControlPlane Guard</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
            ENFORCING
          </span>
        </div>
      </div>
    </aside>
  );
}
