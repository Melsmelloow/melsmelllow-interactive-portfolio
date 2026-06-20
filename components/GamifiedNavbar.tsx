"use client";

import { useState } from "react";
import { useGameStore, type Waypoint } from "@/store/useGameStore";
import { waypoints } from "@/game/waypoints";
import * as THREE from "three";

interface GamifiedNavbarProps {
  onTeleport: (waypoint: Waypoint) => void;
}

export default function GamifiedNavbar({ onTeleport }: GamifiedNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentWaypoint, isTeleporting } = useGameStore();

  const handleTeleport = (waypoint: Waypoint) => {
    onTeleport(waypoint);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      {/* Main navbar container with game-like styling */}
      <div className="relative">
        {/* Navbar background with game UI aesthetic */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-amber-500/30 rounded-full shadow-lg shadow-amber-500/10">
          {/* Compass/Navigation icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50">
            <svg
              className="w-4 h-4 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>

          {/* Current location indicator */}
          <div className="px-3 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20">
            {currentWaypoint 
              ? waypoints.find(wp => wp.id === currentWaypoint)?.label || "Exploring"
              : "Exploring"}
          </div>

          {/* Teleport button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 active:scale-95"
          >
            {isTeleporting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Teleporting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Fast Travel</span>
              </>
            )}
          </button>
        </div>

        {/* Waypoint dropdown menu */}
        {isOpen && !isTeleporting && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-amber-500/30 rounded-2xl shadow-xl shadow-amber-500/20">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 px-2">
                Select Destination
              </div>
              <div className="space-y-1">
                {waypoints.map((waypoint) => (
                  <button
                    key={waypoint.id}
                    onClick={() => handleTeleport(waypoint)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      currentWaypoint === waypoint.id
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                        : "hover:bg-slate-700/50 border border-transparent text-slate-300 hover:text-white"
                    }`}
                  >
                    {/* Waypoint icon */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        currentWaypoint === waypoint.id
                          ? "bg-amber-500/30"
                          : "bg-slate-700/50"
                      }`}
                    >
                      {waypoint.id === "home" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                        </svg>
                      )}
                      {waypoint.id === "about" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {waypoint.id === "skills" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {waypoint.id === "projects" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {waypoint.id === "contact" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {waypoint.id === "experience" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{waypoint.label}</div>
                      {waypoint.description && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          {waypoint.description}
                        </div>
                      )}
                    </div>
                    {currentWaypoint === waypoint.id && (
                      <svg
                        className="w-4 h-4 ml-auto text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}