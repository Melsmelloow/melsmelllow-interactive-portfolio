import * as THREE from "three";
import type { Waypoint } from "@/store/useGameStore";

/**
 * Waypoint definitions for the gamified navigation system.
 * Each waypoint represents a section of the portfolio that the player can teleport to.
 * 
 * The world is organized with different areas:
 * - Center (0, 0, 0): Starting area / Home
 * - North (+Z): About section
 * - South (-Z): Skills section  
 * - East (+X): Projects section
 * - West (-X): Contact section
 * - Northeast: Experience section
 */

export const waypoints: Waypoint[] = [
  {
    id: "home",
    label: "Home",
    position: new THREE.Vector3(0, 0, 0),
    description: "Welcome to my 3D portfolio world",
  },
  {
    id: "about",
    label: "About",
    position: new THREE.Vector3(0, 0, 15),
    description: "Learn more about me",
  },
  {
    id: "skills",
    label: "Skills",
    position: new THREE.Vector3(0, 0, -15),
    description: "Explore my technical skills",
  },
  {
    id: "projects",
    label: "Projects",
    position: new THREE.Vector3(15, 0, 0),
    description: "Check out my work",
  },
  {
    id: "contact",
    label: "Contact",
    position: new THREE.Vector3(-15, 0, 0),
    description: "Get in touch with me",
  },
  {
    id: "experience",
    label: "Experience",
    position: new THREE.Vector3(10, 0, 10),
    description: "My professional journey",
  },
];

export const getWaypointById = (id: string): Waypoint | undefined => {
  return waypoints.find((wp) => wp.id === id);
};

export const getWaypointLabel = (id: string): string => {
  const waypoint = getWaypointById(id);
  return waypoint?.label || id;
};