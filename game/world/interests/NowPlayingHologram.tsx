"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAudioStore } from "@/store/useAudioStore";

interface NowPlayingHologramProps {
  position?: [number, number, number];
}

const SPOTIFY_GREEN = "#1DB954";

export default function NowPlayingHologram({
  position = [0, 1.2, 0],
}: NowPlayingHologramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const isPlaying = useAudioStore((s) => s.isPlaying);

  // Read from the playlist + index directly, instead of the old currentTrack field
  const playlist = useAudioStore((s) => s.playlist);
  const currentTrackIndex = useAudioStore((s) => s.currentTrackIndex);
  const currentTrack = playlist[currentTrackIndex] ?? null;

  const trackTitle = currentTrack?.title ?? "Unknown Track";
  const artistName = currentTrack?.artist ?? "Unknown Artist";

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    ctx.fillStyle = "rgba(18, 18, 18, 0.65)";
    roundRect(0, 0, canvas.width, canvas.height, 24);
    ctx.fill();

    ctx.strokeStyle = SPOTIFY_GREEN;
    ctx.lineWidth = 2;
    roundRect(2, 2, canvas.width - 4, canvas.height - 4, 22);
    ctx.stroke();

    const artSize = 140;
    const artX = 30;
    const artY = (canvas.height - artSize) / 2;
    ctx.fillStyle = "#282828";
    roundRect(artX, artY, artSize, artSize, 10);
    ctx.fill();

    ctx.fillStyle = SPOTIFY_GREEN;
    ctx.font = "bold 50px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♪", artX + artSize / 2, artY + artSize / 2);

    const textX = artX + artSize + 30;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = SPOTIFY_GREEN;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("NOW PLAYING", textX, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(trackTitle, textX, 105);

    ctx.fillStyle = "#b3b3b3";
    ctx.font = "22px sans-serif";
    ctx.fillText(artistName, textX, 140);

    const barBaseX = textX;
    const barBaseY = 175;
    const barWidths = 6;
    const barGap = 5;
    const barHeights = [14, 22, 10, 18];
    barHeights.forEach((h, i) => {
      ctx.fillStyle = SPOTIFY_GREEN;
      ctx.fillRect(barBaseX + i * (barWidths + barGap), barBaseY - h, barWidths, h);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.anisotropy = 4;
    return tex;
  }, [trackTitle, artistName]); // regenerates whenever the track changes

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      groupRef.current.lookAt(camera.position);
    }
  });

  if (!isPlaying) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <planeGeometry args={[1.8, 0.56]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}