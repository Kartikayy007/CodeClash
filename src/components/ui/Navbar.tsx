"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/performance", label: "Performance" },
    { href: "/matches", label: "Matches/Contest" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="relative bg-[#15171B] z-50">
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

        <ul className="hidden lg:flex items-center gap-12 text-base font-bold">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button className="flex items-center">
            <Settings
              size={30}
              className="hover:rotate-90 transition-transform duration-300"
              onClick={() => router.push("/settings")}
            />
          </button>

          <button
            className="lg:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={30} className="text-white" />
            ) : (
              <Menu size={30} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#15171B] border-t border-white/10">
          <ul className="flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-6 py-3 hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
