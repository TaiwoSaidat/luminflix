"use client";

import React, { useState } from "react";
import { cn } from "@/data/mockCategories";
import Logo from "../shared/logo";
import { Search, Bell, X } from "lucide-react";
import Profiles from "../headerComponents/Profiles";
import { ChevronDown } from "lucide-react";

const Header: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    "Home",
    "Series",
    "Films",
    "Games",
    "New & Popular",
    "My List",
    "Browse by Language",
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-linear-to-b from-black/80 to-transparent"
      )}
    >
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />

          {/* DESKTOP NAVIGATION: Visible on md and up */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-gray-200 hover:text-gray-400 transition"
              >
                {item}
              </a>
            ))}
          </div>

          {/* MOBILE/TABLET NAVIGATION: Visible below md */}
          <div className="relative md:hidden">
            <div
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <p className="text-white text-sm">Browse</p>
              <ChevronDown
                className={`w-4 h-4 text-white transition ${
                  showMobileMenu ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {showMobileMenu && (
              <div className="absolute top-10 left-0 w-56 bg-black border border-b-black border-x-black flex flex-col py-2 shadow-xl">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="px-4 py-3 text-sm text-gray-200 hover:bg-zinc-800 transition text-center"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="flex items-center bg-black/80 border border-white px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm outline-none w-32 md:w-64"
                autoFocus
              />
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer ml-2"
                onClick={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <Search
              className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition"
              onClick={() => setShowSearch(true)}
            />
          )}
          <Bell className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition" />
          <Profiles />
        </div>
      </div>
    </header>
  );
};

export default Header;
