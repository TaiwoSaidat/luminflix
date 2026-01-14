"use client";

import React, { useState } from "react";
import { cn } from "@/data/mockCategories";
import Logo from "../shared/logo";
import { Search, Bell, X } from "lucide-react";
import Profiles from "../headerComponents/Profiles";
// import { ChevronDown, ChevronUp } from "lucide-react";

const Header: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-linear-to-b from-black/80 to-transparent"
      )}
    >
      <div className="px-12 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex gap-6">
            {[
              "Home",
              "Series",
              "Films",
              "Games",
              "New & Popular",
              "My List",
              "Browse by Language",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-gray-200 hover:text-white transition"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="flex items-center bg-black/80 border border-white px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm outline-none w-64"
                autoFocus
              />
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer ml-2"
                onClick={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <Search
              className="w-5 h-5 cursor-pointer hover:text-gray-300 transition"
              onClick={() => setShowSearch(true)}
            />
          )}
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          < Profiles />
        </div>
      </div>
    </header>
  );
};

export default Header;
