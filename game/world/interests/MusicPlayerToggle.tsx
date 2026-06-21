"use client";

import { useAudioStore } from "@/store/useAudioStore";

export default function MusicPlayerToggle() {
  const isPlayerOpen = useAudioStore((s) => s.isPlayerOpen);
  const togglePlayer = useAudioStore((s) => s.togglePlayer);

  if (isPlayerOpen) return null; // hide the toggle while the player itself is open

  return (
    <button
      onClick={togglePlayer}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#1DB954",
        border: "none",
        color: "#000",
        fontSize: 20,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        zIndex: 999,
      }}
      aria-label="Open music player"
    >
      ♪
    </button>
  );
}