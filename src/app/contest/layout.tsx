'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavbarPlain from '@/components/ui/NavbarPlain';
import Header from '@/features/battle/editor/components/Header';

export default function ContestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isContestProblem = pathname?.includes('contest/problem');

  return (
    <div className="min-h-screen bg-[#10141D] font-medium">
      {isContestProblem ? (
        <div className="flex flex-col gap-4">
          <Header />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <NavbarPlain />
        </div>
      )}
      {children}
    </div>
  );
}
