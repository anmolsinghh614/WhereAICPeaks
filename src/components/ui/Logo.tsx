'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function LogoIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
      >
        <defs>
          <linearGradient id="wingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="wingRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
          <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id="shieldBottom" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        {/* Left Wings */}
        <path
          d="M10 24 L34 38 L30 52 L12 42 Z"
          fill="url(#wingLeft)"
        />
        <path
          d="M14 46 L30 54 L26 68 L16 60 Z"
          fill="url(#wingLeft)"
          opacity="0.9"
        />

        {/* Right Wings */}
        <path
          d="M90 24 L66 38 L70 52 L88 42 Z"
          fill="url(#wingRight)"
        />
        <path
          d="M86 46 L70 54 L74 68 L84 60 Z"
          fill="url(#wingRight)"
          opacity="0.9"
        />

        {/* Central Isometric Prism / Shield Cube */}
        {/* Top Face */}
        <polygon
          points="50,14 74,28 50,42 26,28"
          fill="url(#cubeTop)"
        />
        {/* Left Face */}
        <polygon
          points="26,28 50,42 50,72 26,56"
          fill="url(#cubeLeft)"
        />
        {/* Right Face */}
        <polygon
          points="74,28 50,42 50,72 74,56"
          fill="url(#cubeRight)"
        />

        {/* Bottom Pointed Shield Apex */}
        <polygon
          points="26,56 50,72 50,88 38,76"
          fill="url(#shieldBottom)"
        />
        <polygon
          points="74,56 50,72 50,88 62,76"
          fill="url(#shieldBottom)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon className={iconSizes[size]} />
      {showText && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-wider ${textSizes[size]} flex items-center leading-none text-white`}>
            <span>CONTROLPLANE</span>
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent ml-0.5">
              .AI
            </span>
          </div>
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-mono font-medium mt-0.5">
            Enterprise AI Ops
          </span>
        </div>
      )}
    </div>
  );
}
