'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserProvider } from '@/context/UserContext';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <UserProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-grid-pattern relative">
          {/* Subtle Ambient Background Gradient Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

          <Header title={title} subtitle={subtitle} />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
            <div className="max-w-[1680px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

