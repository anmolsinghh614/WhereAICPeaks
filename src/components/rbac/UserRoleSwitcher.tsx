'use client';

import React, { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { Shield, Users, User, Check, ChevronDown, Sparkles } from 'lucide-react';

export function UserRoleSwitcher() {
  const { activeUser, users, switchUser } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!activeUser) return null;

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    TEAM_LEAD: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    MEMBER: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    ADMIN: <Shield className="w-3.5 h-3.5 text-rose-400" />,
    TEAM_LEAD: <Users className="w-3.5 h-3.5 text-amber-400" />,
    MEMBER: <User className="w-3.5 h-3.5 text-cyan-400" />,
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all text-xs text-slate-200 group"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-inner">
          {activeUser.name.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
            <span>{activeUser.name}</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border flex items-center gap-1 ${roleColors[activeUser.role]}`}>
              {roleIcons[activeUser.role]}
              {activeUser.role}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{activeUser.teamName}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80">
            <div className="p-3 bg-slate-950/60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  RBAC Persona Switcher
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time isolation</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Switch user personas to test role-based data isolation across Teams and Metrics.
              </p>
            </div>

            <div className="py-1 max-h-72 overflow-y-auto">
              {users.map((u) => {
                const isSelected = u.id === activeUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-slate-800/60 ${
                      isSelected ? 'bg-indigo-500/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                          {u.name}
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded border ${roleColors[u.role]}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{u.teamName} • {u.email}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
