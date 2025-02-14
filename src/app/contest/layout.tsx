'use client';

import React from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';

export default function ContestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#10141D] font-medium">
      <NavbarPlain />
      {children}
    </div>
  );
}
