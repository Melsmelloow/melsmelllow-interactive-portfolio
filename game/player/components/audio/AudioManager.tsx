"use client";

import { useEffect, useRef } from "react";
import { useAudioStore, type TrackInfo } from "@/store/useAudioStore";

// Replace with your actual tracks
const PLAYLIST: TrackInfo[] = [
  { title: "In Bloom", artist: "Neck Deep", src: "/Neck Deep - In Bloom.m4a" },
  { title: "Three Cheers for Five Years", artist: "Mayday Parade", src: "/Mayday Parade - Three Cheers for Five Years.m4a" },
  { title: "Drag Path", artist: "Twenty One Pilots", src: "/Twenty One Pilots - Drag Path.m4a" },
];

export default function AudioManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const setAudioElement = useAudioStore((s) => s.setAudioElement);
  const setPlaylist = useAudioStore((s) => s.setPlaylist);
  const play = useAudioStore((s) => s.play);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioElement(audio);
    setPlaylist(PLAYLIST);

    if (PLAYLIST.length > 0) {
      audio.src = PLAYLIST[0].src;
      play();
    }

    const tryResumeOnInteraction = () => {
      play();
      window.removeEventListener("click", tryResumeOnInteraction);
      window.removeEventListener("keydown", tryResumeOnInteraction);
    };

    window.addEventListener("click", tryResumeOnInteraction);
    window.addEventListener("keydown", tryResumeOnInteraction);

    return () => {
      window.removeEventListener("click", tryResumeOnInteraction);
      window.removeEventListener("keydown", tryResumeOnInteraction);
      setAudioElement(null);
    };
  }, [setAudioElement, setPlaylist, play]);

  // Auto-advance to next track when one ends (since playlist isn't a native <audio> feature)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      useAudioStore.getState().nextTrack();
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return <audio ref={audioRef} loop={false} preload="auto" />;
}