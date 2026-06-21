import * as THREE from "three";
import type { Waypoint } from "@/store/useGameStore";

// Room/interior centers — used by DisplayRoom, InterestProps, etc.
export const ROOM_CENTERS = {
  about: new THREE.Vector3(0, 0, 15),
  skills: new THREE.Vector3(0, 0, -15),
  projects: new THREE.Vector3(15, 0, 0),
  contact: new THREE.Vector3(-15, 0, 0),
  experience: new THREE.Vector3(10, 0, 10),
};

export const waypoints: Waypoint[] = [
  {
    id: "home",
    label: "Home",
    position: new THREE.Vector3(0, 0, 0),
    description: "Welcome to my 3D portfolio world",
    boardContent: {
      title: "Welcome",
      body: "Welcome to my interactive 3D portfolio. Walk around or teleport to explore each section.",
    },
  },
  {
    id: "about",
    label: "About",
    position: new THREE.Vector3(0, 0, 23), // outside the room entrance (teleport target)
    description: "Learn more about me",
    boardContent: {
      title: "About Me",
      body: "Your about text here...",
      position: new THREE.Vector3(-8, 0, 15), // board's own world position, inside the room
      rotation: [0, Math.PI / 2, 0], // facing West
    },
  },
  {
    id: "skills",
    label: "Skills",
    position: new THREE.Vector3(0, 0, -15),
    description: "Explore my technical skills",
    boardContent: {
      title: "Skills",
      body: "Your skills list here...",
    },
  },
  {
    id: "projects",
    label: "Projects",
    position: new THREE.Vector3(15, 0, 0),
    description: "Check out my work",
    boardContent: {
      title: "Projects",
      body: "Your projects here...",
    },
  },
  {
    id: "contact",
    label: "Contact",
    position: new THREE.Vector3(-15, 0, 0),
    description: "Get in touch with me",
    boardContent: {
      title: "Contact",
      body: "Your contact info here...",
    },
  },
  {
    id: "experience",
    label: "Experience",
    position: new THREE.Vector3(10, 0, 10),
    description: "My professional journey",
    boardContent: {
      title: "Experience",
      body: "Your experience timeline here...",
    },
  },
];

export const getWaypointById = (id: string): Waypoint | undefined => {
  return waypoints.find((wp) => wp.id === id);
};

export const getWaypointLabel = (id: string): string => {
  const waypoint = getWaypointById(id);
  return waypoint?.label || id;
};