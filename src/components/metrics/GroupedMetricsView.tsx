'use client';

import React, { useState } from 'react';
import { TeamUsageMetric, UserUsageMetric } from '@/types';
import {
  Users,
  User,
  Activity,
  DollarSign,
  Zap,
  Clock,
  ShieldAlert,
  XCircle,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';

interface GroupedMetricsViewProps {
  teamUsage: TeamUsageMetric[];
  userUsage: UserUsageMetric[];
}

export function GroupedMetricsView({ teamUsage, userUsage }: GroupedMetricsViewProps) {
  const [viewMode, setViewMode] = useState<'TEAMS' | 'USERS'>('TEAMS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  const departments = Array.from(new Set(teamUsage.map((t) => t.department)));

  const filteredTeams = teamUsage.filter((t) => {
    const matchesSearch =
      t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'ALL' || t.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const filteredUsers = userUsage.filter((u) => {
    return (
      u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userRole.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-rose-500/10 text-rose-700 border-rose-200',
    TEAM_LEAD: 'bg-amber-500/10 text-amber-700 border-amber-200',
    MEMBER: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Granular Governance Telemetry by Teams & Users
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Group resource utilization, AI budget spend, latency, and security risk scores across enterprise units
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setViewMode('TEAMS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'TEAMS'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>View by Teams</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono">
              {teamUsage.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('USERS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'USERS'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>View by Users</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono">
              {userUsage.length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={viewMode === 'TEAMS' ? 'Search teams or departments...' : 'Search by user email, name or team...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
          />
        </div>

        {viewMode === 'TEAMS' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-600 font-semibold">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TEAMS VIEW */}
      {viewMode === 'TEAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team.teamId}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h4 className="text-sm font-bold text-slate-900">{team.teamName}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium ml-4 mt-0.5">{team.department}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold border border-slate-200">
                  {team.teamId}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold uppercase">
                    <Activity className="w-3 h-3 text-blue-500" /> Requests
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                    {team.requests.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold uppercase">
                    <DollarSign className="w-3 h-3 text-emerald-500" /> Cost
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
                    ${team.cost.toFixed(2)}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold uppercase">
                    <Zap className="w-3 h-3 text-purple-500" /> Tokens
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                    {(team.tokens / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Latency: <strong>{team.avgLatencyMs}ms</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Risk Score: <strong className="text-amber-700">{team.avgRisk}/100</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>Blocked: <strong className="text-red-600">{team.blockedCount}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS VIEW TABLE */}
      {viewMode === 'USERS' && (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">User Email / Name</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3">Requests</th>
                <th className="py-3 px-3">Tokens</th>
                <th className="py-3 px-3">Cost ($)</th>
                <th className="py-3 px-3">Avg Latency</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Blocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredUsers.map((usr) => (
                <tr key={usr.userId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-sans">
                    <div className="font-semibold text-slate-900">{usr.userName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{usr.userEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold border ${roleColors[usr.userRole]}`}>
                      {usr.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700 font-medium">
                    {usr.teamName}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {usr.requests.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {(usr.tokens / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">
                    ${usr.cost.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-blue-700">
                    {usr.avgLatencyMs} ms
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.avgRisk < 30
                          ? 'bg-emerald-100 text-emerald-800'
                          : usr.avgRisk < 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {usr.avgRisk}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-red-600 font-bold">
                    {usr.blockedCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
