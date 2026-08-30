'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Team, User } from '@/types';

interface UserContextType {
  activeUser: User | null;
  users: User[];
  teams: Team[];
  switchUser: (userId: string) => void;
  createNewTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'spentToday' | 'memberCount'>) => Promise<Team | null>;
  createNewUser: (userData: Omit<User, 'id'>) => Promise<User | null>;
  refreshUsersAndTeams: () => void;
  hasAdminAccess: boolean;
  hasTeamLeadAccess: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team-executive',
    name: 'Executive Core',
    description: 'Global enterprise admins, risk officers, and governance architects.',
    department: 'Corporate & Risk',
    dailyBudgetLimit: 500.0,
    spentToday: 110.45,
    memberCount: 1,
    createdAt: '2026-08-01T08:00:00Z',
    assignedVirtualModels: ['vm-demo-guard'],
  },
  {
    id: 'team-finance',
    name: 'Finance & Accounting',
    description: 'Internal financial services, invoice automation, and audit analytics.',
    department: 'Finance',
    dailyBudgetLimit: 150.0,
    spentToday: 42.84,
    memberCount: 2,
    createdAt: '2026-08-05T10:00:00Z',
    assignedVirtualModels: ['vm-finance-assistant'],
  },
  {
    id: 'team-engineering',
    name: 'Engineering & DevOps',
    description: 'Internal developer platform, code copilot, and system architecture.',
    department: 'Technology',
    dailyBudgetLimit: 200.0,
    spentToday: 89.15,
    memberCount: 2,
    createdAt: '2026-08-02T12:30:00Z',
    assignedVirtualModels: ['vm-engineering-copilot'],
  },
  {
    id: 'team-support',
    name: 'Customer Experience',
    description: 'Global customer helpdesk, automated resolution, and support agents.',
    department: 'Customer Service',
    dailyBudgetLimit: 100.0,
    spentToday: 31.22,
    memberCount: 1,
    createdAt: '2026-08-10T15:00:00Z',
    assignedVirtualModels: ['vm-customer-support'],
  },
];

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Anmol Singh',
    email: 'anmol.singh@enterprise.com',
    role: 'ADMIN',
    teamId: 'team-executive',
    teamName: 'Executive Core',
    title: 'Chief Risk Officer & Lead Architect',
  },
  {
    id: 'usr-fin-lead',
    name: 'Sanchay Baranwal',
    email: 'sanchay.baranwal@finance-corp.com',
    role: 'TEAM_LEAD',
    teamId: 'team-finance',
    teamName: 'Finance & Accounting',
    title: 'VP of Finance & Risk Ops',
  },
  {
    id: 'usr-fin-member',
    name: 'Swaralipi Datta',
    email: 'swaralipi.datta@finance-corp.com',
    role: 'MEMBER',
    teamId: 'team-finance',
    teamName: 'Finance & Accounting',
    title: 'Senior Risk & Financial Analyst',
  },
  {
    id: 'usr-eng-lead',
    name: 'Akansha Singh',
    email: 'akansha.singh@tech-corp.com',
    role: 'TEAM_LEAD',
    teamId: 'team-engineering',
    teamName: 'Engineering & DevOps',
    title: 'Principal AI Platform Architect',
  },
  {
    id: 'usr-eng-member',
    name: 'Mahiya Agarwal',
    email: 'mahiya.agarwal@tech-corp.com',
    role: 'MEMBER',
    teamId: 'team-engineering',
    teamName: 'Engineering & DevOps',
    title: 'DevOps & AI Governance Specialist',
  },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [activeUser, setActiveUser] = useState<User | null>(DEFAULT_USERS[0]);
  const [loading, setLoading] = useState(true);

  const fetchUsersAndTeams = async () => {
    try {
      const [uRes, tRes, activeRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/teams'),
        fetch('/api/users/active'),
      ]);

      if (uRes.ok && tRes.ok) {
        const uData = await uRes.json();
        const tData = await tRes.json();
        if (uData.users?.length) setUsers(uData.users);
        if (tData.teams?.length) setTeams(tData.teams);

        if (activeRes.ok) {
          const actData = await activeRes.json();
          if (actData.user) setActiveUser(actData.user);
        }
      }
    } catch (err) {
      console.error('Failed to load users/teams context', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndTeams();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/users/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveUser(data.user);
        // Refresh page data across listeners
        window.dispatchEvent(new CustomEvent('rbac-user-changed', { detail: data.user }));
      }
    } catch (err) {
      console.error('Error switching user', err);
    }
  };

  const createNewTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'spentToday' | 'memberCount'>) => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });
      if (res.ok) {
        const data = await res.json();
        fetchUsersAndTeams();
        return data.team;
      }
    } catch (err) {
      console.error('Error creating team', err);
    }
    return null;
  };

  const createNewUser = async (userData: Omit<User, 'id'>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
        fetchUsersAndTeams();
        return data.user;
      }
    } catch (err) {
      console.error('Error creating user', err);
    }
    return null;
  };

  const hasAdminAccess = activeUser?.role === 'ADMIN';
  const hasTeamLeadAccess = activeUser?.role === 'ADMIN' || activeUser?.role === 'TEAM_LEAD';

  return (
    <UserContext.Provider
      value={{
        activeUser,
        users,
        teams,
        switchUser,
        createNewTeam,
        createNewUser,
        refreshUsersAndTeams: fetchUsersAndTeams,
        hasAdminAccess,
        hasTeamLeadAccess,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const defaultFallbackContext: UserContextType = {
  activeUser: DEFAULT_USERS[0],
  users: DEFAULT_USERS,
  teams: DEFAULT_TEAMS,
  switchUser: () => {},
  createNewTeam: async () => null,
  createNewUser: async () => null,
  refreshUsersAndTeams: () => {},
  hasAdminAccess: true,
  hasTeamLeadAccess: true,
  loading: false,
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    return defaultFallbackContext;
  }
  return context;
}
