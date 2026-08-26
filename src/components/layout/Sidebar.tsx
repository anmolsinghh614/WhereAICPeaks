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
  Shield,
  Radio,
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
    <aside className="w-64 bg-[#0B0F19] text-slate-300 flex flex-col border-r border-slate-800/80 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3 bg-[#0B0F19]/50">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-mono font-extrabold text-sm tracking-wider">
          <Shield className="w-4 h-4 fill-white" />
        </div>
        <div>
          <div className="text-white font-extrabold text-sm tracking-wide flex items-center gap-1">
            CONTROLPLANE<span className="text-blue-400 font-mono text-xs">.AI</span>
          </div>
          <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase font-mono">
            Enterprise AI Ops & Governance
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2 font-mono">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
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
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2 font-mono">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Real-Time Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19]">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">ControlPlane Guard</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 font-bold">
            ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
}
