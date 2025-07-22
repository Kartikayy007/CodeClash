"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { LogOut, Home, Settings } from 'lucide-react';

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

  const handleHome = () => {
    router.push("/dashboard");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <nav className="relative bg-[#10141D] z-50">
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Image
            src="/logo.svg"
            alt="Code Clash"
            width={120}
            height={30}
            className="sm:w-[162px] sm:h-[40px]"
            priority
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleHome}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-[#2A2F3E] hover:bg-[#3A3F4E] transition-colors"
          >
            <Home size={18} className="text-white sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-white text-sm font-medium">Home</span>
          </button>
          
          <button
            onClick={handleSettings}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-[#2A2F3E] hover:bg-[#3A3F4E] transition-colors"
          >
            <Settings size={18} className="text-white sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-white text-sm font-medium">Settings</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-[#2A2F3E] hover:bg-[#3A3F4E] transition-colors"
          >
            <LogOut size={18} className="text-white sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-white text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
