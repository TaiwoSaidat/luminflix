import { useState } from "react";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { profiles } from "@/data/mockProfiles";

export default function Profiles() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex gap-1 items-center cursor-pointer"
      >
        <div className="w-8 h-8 rounded bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center">
          <span className="text-sm font-semibold">U</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 mt-1 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-zinc-900 shadow-lg border border-zinc-800">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 transition"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="text-xs">{profile.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
