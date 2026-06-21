"use client";

import { useAudioStore } from "@/store/useAudioStore";

const SPOTIFY_GREEN = "#1DB954";

export default function MusicPlayer() {
  const isPlayerOpen = useAudioStore((s) => s.isPlayerOpen);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const playlist = useAudioStore((s) => s.playlist);
  const currentTrackIndex = useAudioStore((s) => s.currentTrackIndex);
  const togglePlayback = useAudioStore((s) => s.togglePlayback);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const closePlayer = useAudioStore((s) => s.closePlayer);

  if (!isPlayerOpen) return null;

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        background: "#181818",
        borderRadius: 12,
        padding: "14px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        border: `1px solid rgba(29, 185, 84, 0.3)`,
        zIndex: 1000,
        fontFamily: "sans-serif",
      }}
    >
      {/* Close button */}
      <button
        onClick={closePlayer}
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          background: "none",
          border: "none",
          color: "#b3b3b3",
          fontSize: 16,
          cursor: "pointer",
          lineHeight: 1,
        }}
        aria-label="Close player"
      >
        ✕
      </button>

      {/* Track info row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 6,
            background: "#282828",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: SPOTIFY_GREEN,
            flexShrink: 0,
          }}
        >
          ♪
        </div>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack?.title ?? "No track"}
          </div>
          <div
            style={{
              color: "#b3b3b3",
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack?.artist ?? ""}
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <button
          onClick={prevTrack}
          style={iconButtonStyle}
          aria-label="Previous track"
        >
          ⏮
        </button>

        <button
          onClick={togglePlayback}
          style={{
            ...iconButtonStyle,
            background: SPOTIFY_GREEN,
            color: "#000",
            width: 36,
            height: 36,
            borderRadius: "50%",
            fontSize: 16,
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          onClick={nextTrack}
          style={iconButtonStyle}
          aria-label="Next track"
        >
          ⏭
        </button>
      </div>

      {/* Track list (click to jump to a track) */}
      {playlist.length > 1 && (
        <div
          style={{
            marginTop: 14,
            borderTop: "1px solid #282828",
            paddingTop: 10,
            maxHeight: 120,
            overflowY: "auto",
          }}
        >
          {playlist.map((track, i) => (
            <div
              key={track.src}
              onClick={() => useAudioStore.getState().selectTrack(i)}
              style={{
                padding: "6px 4px",
                borderRadius: 4,
                cursor: "pointer",
                background:
                  i === currentTrackIndex ? "rgba(29, 185, 84, 0.15)" : "transparent",
                color: i === currentTrackIndex ? SPOTIFY_GREEN : "#b3b3b3",
                fontSize: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {track.title}
              </span>
              <span style={{ color: "#777", marginLeft: 8, flexShrink: 0 }}>
                {track.artist}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};