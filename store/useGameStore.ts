"use client";

import { create } from "zustand";
import * as THREE from "three";

export interface Waypoint {
  id: string;
  label: string;
  position: THREE.Vector3;
  description?: string;
}

interface GameState {
  // Dialog state
  showDialog: boolean;
  dialogText: string;
  currentDialogIndex: number;
  
  // Teleportation state
  teleportTarget: THREE.Vector3 | null;
  isTeleporting: boolean;
  currentWaypoint: string | null;
  
  // Actions
  setShowDialog: (show: boolean) => void;
  setDialogText: (text: string) => void;
  setCurrentDialogIndex: (index: number) => void;
  nextDialog: () => void;
  closeDialog: () => void;
  
  // Teleportation actions
  teleportTo: (position: THREE.Vector3, waypointId?: string) => void;
  cancelTeleport: () => void;
  completeTeleport: () => void;
  setCurrentWaypoint: (waypointId: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  showDialog: true,
  dialogText: "",
  currentDialogIndex: 0,
  
  // Teleportation state
  teleportTarget: null,
  isTeleporting: false,
  currentWaypoint: null,
  
  // Actions
  setShowDialog: (show) => set({ showDialog: show }),
  setDialogText: (text) => set({ dialogText: text }),
  setCurrentDialogIndex: (index) => set({ currentDialogIndex: index }),
  
  nextDialog: () => set((state) => ({ currentDialogIndex: state.currentDialogIndex + 1 })),
  closeDialog: () => set({ showDialog: false }),
  
  // Teleportation actions
  teleportTo: (position: THREE.Vector3, waypointId) => set({
    teleportTarget: position.clone(),
    isTeleporting: true,
    currentWaypoint: waypointId || null,
  }),
  cancelTeleport: () => set({
    teleportTarget: null,
    isTeleporting: false,
  }),
  completeTeleport: () => set({
    isTeleporting: false,
  }),
  setCurrentWaypoint: (waypointId) => set({ currentWaypoint: waypointId }),
}));