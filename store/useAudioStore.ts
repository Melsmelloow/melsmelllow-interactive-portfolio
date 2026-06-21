"use client";

import { create } from "zustand";
import * as THREE from "three";

export interface TrackInfo {
  title: string;
  artist: string;
  src: string;
}

interface AudioState {
  isPlaying: boolean;
  isReady: boolean;
  audioElement: HTMLAudioElement | null;
  playlist: TrackInfo[];
  currentTrackIndex: number;
  isPlayerOpen: boolean;
  turntablePosition: THREE.Vector3 | null; // NEW

  setAudioElement: (el: HTMLAudioElement | null) => void;
  setPlaylist: (tracks: TrackInfo[]) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  openPlayer: () => void;
  closePlayer: () => void;
  togglePlayer: () => void;
  setTurntablePosition: (pos: THREE.Vector3) => void; // NEW
  updateVolumeFromPlayerPosition: (playerPos: THREE.Vector3) => void; // NEW
}

// Proximity falloff tuning
// Proximity falloff tuning
const MAX_VOLUME_DISTANCE = 4; // within this distance, full volume
const MIN_VOLUME_DISTANCE = 20; // beyond this distance, settles at the quiet floor
const MIN_VOLUME = 0.15; // NEW: never goes below this — subtle ambient presence everywhere
const MAX_VOLUME = 0.7; // full volume when close

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  isReady: false,
  audioElement: null,
  playlist: [],
  currentTrackIndex: 0,
  isPlayerOpen: false,
  turntablePosition: null,

  setAudioElement: (el) => set({ audioElement: el, isReady: !!el }),
  setPlaylist: (tracks) => set({ playlist: tracks }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  play: () => {
    const { audioElement } = get();
    if (!audioElement) return;
    audioElement
      .play()
      .then(() => set({ isPlaying: true }))
      .catch((err) => {
        console.warn("Audio play() was blocked or failed:", err);
        set({ isPlaying: false });
      });
  },

  pause: () => {
    const { audioElement } = get();
    if (!audioElement) return;
    audioElement.pause();
    set({ isPlaying: false });
  },

  togglePlayback: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) pause();
    else play();
  },

  nextTrack: () => {
    const { playlist, currentTrackIndex, audioElement, play } = get();
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    set({ currentTrackIndex: nextIndex });
    if (audioElement) {
      audioElement.src = playlist[nextIndex].src;
      play();
    }
  },

  prevTrack: () => {
    const { playlist, currentTrackIndex, audioElement, play } = get();
    if (playlist.length === 0) return;
    const prevIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    set({ currentTrackIndex: prevIndex });
    if (audioElement) {
      audioElement.src = playlist[prevIndex].src;
      play();
    }
  },

  selectTrack: (index) => {
    const { playlist, audioElement, play } = get();
    if (index < 0 || index >= playlist.length) return;
    set({ currentTrackIndex: index });
    if (audioElement) {
      audioElement.src = playlist[index].src;
      play();
    }
  },

  openPlayer: () => set({ isPlayerOpen: true }),
  closePlayer: () => set({ isPlayerOpen: false }),
  togglePlayer: () => set((s) => ({ isPlayerOpen: !s.isPlayerOpen })),

  setTurntablePosition: (pos) => set({ turntablePosition: pos }),

  updateVolumeFromPlayerPosition: (playerPos) => {
    const { audioElement, turntablePosition } = get();
    if (!audioElement || !turntablePosition) return;

    const distance = playerPos.distanceTo(turntablePosition);

    const t = THREE.MathUtils.clamp(
      (distance - MAX_VOLUME_DISTANCE) /
        (MIN_VOLUME_DISTANCE - MAX_VOLUME_DISTANCE),
      0,
      1,
    );
    const volume = THREE.MathUtils.lerp(MAX_VOLUME, MIN_VOLUME, t);

    audioElement.volume = volume;
  },
}));
