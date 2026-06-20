"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";

interface AnnouncementBoardProps {
  position: THREE.Vector3;
  id: string;
  title: string;
  body: string;
}

export default function AnnouncementBoard({
  position,
  id,
  title,
  body,
}: AnnouncementBoardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { openBoardView } = useGameStore();

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation?.();
    openBoardView(id);
  };

  // Generate a canvas texture with the title + body baked onto it,
  // styled to look like a printed poster pinned to the cork board.
  const boardTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Cork background
    ctx.fillStyle = "#C8965A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle cork texture speckling
    ctx.fillStyle = "rgba(139, 90, 43, 0.15)";
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // "Paper" poster area
    const paperX = 40;
    const paperY = 30;
    const paperW = canvas.width - 80;
    const paperH = canvas.height - 60;
    ctx.fillStyle = "#fdf6e3";
    ctx.fillRect(paperX, paperY, paperW, paperH);
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(paperX, paperY, paperW, paperH);

    // Pin
    ctx.fillStyle = "#cc3333";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, paperY - 4, 8, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = "#2b2b2b";
    ctx.font = "bold 38px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, paperY + 60);

    // Divider line
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.moveTo(paperX + 30, paperY + 80);
    ctx.lineTo(paperX + paperW - 30, paperY + 80);
    ctx.stroke();

    // Body text, word-wrapped
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#3a3a3a";
    ctx.textAlign = "left";
    const maxLineWidth = paperW - 60;
    const words = body.split(" ");
    let line = "";
    let lineY = paperY + 120;
    const lineHeight = 28;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = ctx.measureText(testLine).width;
      if (width > maxLineWidth && line) {
        ctx.fillText(line, paperX + 30, lineY);
        line = word;
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, paperX + 30, lineY);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [title, body]);

  const boardPos = [position.x + 2, position.y, position.z];

  return (
    <group position={boardPos as [number, number, number]}  scale={[2, 2, 2]}>
      {/* Frame */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.7, 1.3, 0.1]} />
        <meshStandardMaterial color="#A0682B" />
      </mesh>

      {/* Cork face - clickable, now textured with the poster content */}
      <mesh
        ref={meshRef}
        position={[0, 1.4, 0.06]}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[1.5, 1.1, 0.02]} />
        {boardTexture ? (
          <meshStandardMaterial map={boardTexture} />
        ) : (
          <meshStandardMaterial color="#C8965A" />
        )}
      </mesh>

      {/* Legs */}
      <mesh position={[-0.65, 0.6, -0.1]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[0.65, 0.6, -0.1]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[-0.65, 0.6, 0.1]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[0.65, 0.6, 0.1]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
    </group>
  );
}