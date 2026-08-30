'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUserContext } from '@/context/UserContext';
import {
  Users,
  ShieldCheck,
  Building2,
  Plus,
  UserPlus,
  Shield,
  CheckCircle2,
  Lock,
  DollarSign,
  Layers,
  Search,
  ChevronRight,
  Info,
} from 'lucide-react';
import { UserRole } from '@/types';

export default function TeamsPage() {
  const { teams, users, activeUser, createNewTeam, createNewUser, hasAdminAccess } = useUserContext();

  // Create Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [department, setDepartment] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(200);

  // Create User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userTitle, setUserTitle] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('MEMBER');

  const [activeTab, setActiveTab] = useState<'TEAMS' | 'USERS' | 'RBAC_RULES'>('TEAMS');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    const res = await createNewTeam({
      name: teamName,
      description: teamDesc,
      department: department || 'General',
      dailyBudgetLimit: Number(budgetLimit),
      assignedVirtualModels: [],
    });
    if (res) {
      setShowTeamModal(false);
      setTeamName('');
      setTeamDesc('');
      setDepartment('');
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !selectedTeamId) return;
    const team = teams.find((t) => t.id === selectedTeamId);
    const res = await createNewUser({
      name: userName,
      email: userEmail,
      title: userTitle || 'Operator',
      teamId: selectedTeamId,
      teamName: team?.name || 'General',
      role: selectedRole,
    });
    if (res) {
      setShowUserModal(false);
      setUserName('');
      setUserEmail('');
      setUserTitle('');
    }
  };

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
    TEAM_LEAD: 'bg-amber-50 text-amber-700 border-amber-200',
    MEMBER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  return (
    <AppLayout
      title="Teams & Role-Based Access Control (RBAC)"
      subtitle="Manage enterprise teams, member roles, daily spend quotas, and data isolation boundaries"
    >
      <div className="space-y-6">
        {/* Top Overview & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Enterprise Multi-Tenant Security & Isolation
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Active User: {activeUser?.name} ({activeUser?.role})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data isolation ensures teams only access their endpoints, traces, and metrics. Admins hold global policy authority.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasAdminAccess && (
              <>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Team</span>
                </button>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TEAMS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'TEAMS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Teams ({teams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'USERS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Members & Directory ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('RBAC_RULES')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'RBAC_RULES'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Access Hierarchy & Matrix</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter teams or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* TAB 1: TEAMS GRID */}
        {activeTab === 'TEAMS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredTeams.map((team) => {
              const teamMembers = users.filter((u) => u.teamId === team.id);
              const utilizationPct = Math.round((team.spentToday / team.dailyBudgetLimit) * 100);

              return (
                <div
                  key={team.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-indigo-600" />
                          <h3 className="text-base font-extrabold text-slate-900">{team.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{team.description}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                        {team.department}
                      </span>
                    </div>

                    {/* Daily Spend Quota Bar */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-600 font-semibold flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Daily Spend Quota
                        </span>
                        <span className="font-bold text-slate-900">
                          ${team.spentToday.toFixed(2)} / ${team.dailyBudgetLimit.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            utilizationPct > 80 ? 'bg-red-500' : utilizationPct > 50 ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.min(100, utilizationPct)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right text-slate-400 font-mono">{utilizationPct}% utilized today</div>
                    </div>
                  </div>

                  {/* Members & Models summary */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700 font-medium">
                        {teamMembers.length} active member{teamMembers.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-600 font-mono text-[11px]">
                        {team.assignedVirtualModels?.length || 1} virtual endpoint(s)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MEMBERS DIRECTORY */}
        {activeTab === 'USERS' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                User Roster & Access Scopes
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Showing {filteredUsers.length} active users</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Title / Role</th>
                    <th className="py-3 px-4">RBAC Scope</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
                            {usr.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{usr.name}</div>
                            <div className="text-[11px] text-slate-500">{usr.title || 'Enterprise Operator'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 text-xs">
                        {usr.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-mono rounded-lg font-bold border ${roleColors[usr.role]}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {usr.role === 'ADMIN' && 'Full Global Access across all teams & traces'}
                        {usr.role === 'TEAM_LEAD' && 'Team-wide trace inspection & budget control'}
                        {usr.role === 'MEMBER' && 'Personal activity + Team dataset access'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {usr.teamName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ACCESS HIERARCHY MATRIX */}
        {activeTab === 'RBAC_RULES' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">ADMIN Persona</h3>
              <p className="text-xs text-slate-600">
                Global governance authority. Admins can inspect all traces, manage foundational models, create teams, configure guardrails, and audit global spending.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> View all team traces & metrics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Modify guardrail policies</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Manage team budgets & users</li>
              </ul>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">TEAM LEAD Persona</h3>
              <p className="text-xs text-slate-600">
                Departmental manager scope. Team leads oversee their team's LLM consumption, virtual models, and trace records without accessing other departments.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> View team-wide execution traces</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Monitor team budget utilization</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Configure team virtual endpoints</li>
              </ul>
            </div>

            <div className="bg-white border border-cyan-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">MEMBER Persona</h3>
              <p className="text-xs text-slate-600">
                Individual operator scope. Members can execute requests through assigned team virtual endpoints and view their individual trace history and team context.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" /> Execute LLM playground queries</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" /> Inspect own execution traces</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" /> Restricted from modifying policy</li>
              </ul>
            </div>
          </div>
        )}

        {/* CREATE TEAM MODAL */}
        {showTeamModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" /> Create New Enterprise Team
                </h3>
                <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Risk Analytics"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Compliance & Legal"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Daily Spend Budget Cap ($)</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Team scope and responsibilities..."
                    value={teamDesc}
                    onChange={(e) => setTeamDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowTeamModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold"
                  >
                    Save Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE USER MODAL */}
        {showUserModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" /> Provision New User
                </h3>
                <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alice Smith"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alice.smith@enterprise.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Risk Officer"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assign Team</label>
                  <select
                    required
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="">Select Team...</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assign Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="MEMBER">MEMBER (Individual scope)</option>
                    <option value="TEAM_LEAD">TEAM_LEAD (Team scope)</option>
                    <option value="ADMIN">ADMIN (Global scope)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
