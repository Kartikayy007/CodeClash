"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  // const pathname = usePathname();

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <nav className="relative bg-[#10141D] z-50">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Code Clash"
            width={162}
            height={40}
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2F3E] hover:bg-[#3A3F4E] transition-colors"
          >
            <LogOut size={20} className="text-white" />
            <span className="text-white text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
