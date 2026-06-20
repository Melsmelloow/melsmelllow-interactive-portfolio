"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

// Full morning -> sunset -> morning cycle duration, in seconds
const CYCLE_DURATION = 120;

// Keyframe definitions: morning (t=0) and sunset (t=1)
const MORNING = {
  sunY: 25,
  sunX: 60,
  sunZ: 80,
  turbidity: 4,
  rayleigh: 1.2,
  mieCoefficient: 0.003,
  mieDirectionalG: 0.7,
  ambientColor: new THREE.Color("#fdf6e3"),
  ambientIntensity: 1.1,
  lightColor: new THREE.Color("#fff4d6"),
  lightIntensity: 2.2,
};

const SUNSET = {
  sunY: 4,
  sunX: 50,
  sunZ: 100,
  turbidity: 8,
  rayleigh: 2,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.7,
  ambientColor: new THREE.Color("#ffc89a"),
  ambientIntensity: 1,
  lightColor: new THREE.Color("#ffb37b"),
  lightIntensity: 2,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function DynamicSky() {
  const elapsed = useRef(0);
  const [skyParams, setSkyParams] = useState({
    sunPosition: [MORNING.sunX, MORNING.sunY, MORNING.sunZ] as [number, number, number],
    turbidity: MORNING.turbidity,
    rayleigh: MORNING.rayleigh,
    mieCoefficient: MORNING.mieCoefficient,
    mieDirectionalG: MORNING.mieDirectionalG,
  });
  const [lightParams, setLightParams] = useState({
    ambientColor: MORNING.ambientColor.clone(),
    ambientIntensity: MORNING.ambientIntensity,
    lightColor: MORNING.lightColor.clone(),
    lightIntensity: MORNING.lightIntensity,
  });

  useFrame((_, delta) => {
    elapsed.current += delta;

    // Triangle wave: 0 -> 1 -> 0, smooth ping-pong, never wraps past 1 into "night"
    const t = (elapsed.current % CYCLE_DURATION) / CYCLE_DURATION; // 0..1 linear
    const triangle = t < 0.5 ? t * 2 : 2 - t * 2; // 0..1..0

    setSkyParams({
      sunPosition: [
        lerp(MORNING.sunX, SUNSET.sunX, triangle),
        lerp(MORNING.sunY, SUNSET.sunY, triangle),
        lerp(MORNING.sunZ, SUNSET.sunZ, triangle),
      ],
      turbidity: lerp(MORNING.turbidity, SUNSET.turbidity, triangle),
      rayleigh: lerp(MORNING.rayleigh, SUNSET.rayleigh, triangle),
      mieCoefficient: lerp(MORNING.mieCoefficient, SUNSET.mieCoefficient, triangle),
      mieDirectionalG: lerp(MORNING.mieDirectionalG, SUNSET.mieDirectionalG, triangle),
    });

    setLightParams({
      ambientColor: MORNING.ambientColor.clone().lerp(SUNSET.ambientColor, triangle),
      ambientIntensity: lerp(MORNING.ambientIntensity, SUNSET.ambientIntensity, triangle),
      lightColor: MORNING.lightColor.clone().lerp(SUNSET.lightColor, triangle),
      lightIntensity: lerp(MORNING.lightIntensity, SUNSET.lightIntensity, triangle),
    });
  });

  return (
    <>
      <Sky
        sunPosition={skyParams.sunPosition}
        turbidity={skyParams.turbidity}
        rayleigh={skyParams.rayleigh}
        mieCoefficient={skyParams.mieCoefficient}
        mieDirectionalG={skyParams.mieDirectionalG}
      />
      <ambientLight intensity={lightParams.ambientIntensity} color={lightParams.ambientColor} />
      <directionalLight
        position={skyParams.sunPosition}
        intensity={lightParams.lightIntensity}
        color={lightParams.lightColor}
        castShadow
      />
    </>
  );
}