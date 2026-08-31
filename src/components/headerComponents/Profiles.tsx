// This file uses useState. It previously had no "use client" directive and
// worked only because Header was a Client Component; now that Header is a
// Server Component, the directive is load-bearing.
"use client";

import { useState } from "react";
import React from "react";
import { ChevronDown, LogOut, UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Profile } from "@/data/mockProfiles";
import { setActiveProfile } from "@/lib/actions/profile";
import { logout } from "@/lib/actions/auth";
import { ROUTES } from "@/lib/constants";

interface ProfilesProps {
  profiles: Profile[];
  activeProfile: Profile;
}

export default function Profiles({ profiles, activeProfile }: ProfilesProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu, current profile ${activeProfile.name}`}
        className="flex gap-1 items-center cursor-pointer"
      >
        <div className="w-8 h-8 rounded bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center">
          <Image
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-6 h-6 rounded-md"
          />
        </div>
        <ChevronDown
          className={`w-4 h-4 mt-1 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-lg bg-zinc-900 shadow-lg border border-zinc-800 py-1"
        >
          {profiles.map((profile) => (
            // A form rather than an onClick, so switching profiles works
            // without client JS and the cookie is written server-side.
            <form
              key={profile.id}
              action={setActiveProfile.bind(null, profile.id)}
            >
              <button
                type="submit"
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={profile.id === activeProfile.id}
                className={`flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 transition ${
                  profile.id === activeProfile.id ? "bg-zinc-800/60" : ""
                }`}
              >
                <Image
                  src={profile.avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span className="text-xs">{profile.name}</span>
              </button>
            </form>
          ))}

          <div className="my-1 border-t border-zinc-800" />

          <Link
            href={ROUTES.PROFILES}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 transition text-xs"
          >
            <UserCog className="w-4 h-4" />
            Manage Profiles
          </Link>

          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 transition text-xs"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
