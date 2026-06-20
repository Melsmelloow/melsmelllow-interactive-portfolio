"use client";

interface HairProps {
  color?: string;
}

export function Hair({ color = "#1a1a1a" }: HairProps) {
  return (
    <group>
      {/* Top hair - full sphere cap covering entire top and sides */}
      <mesh position={[0, 0.12, -0.02]}>
        <sphereGeometry args={[0.53, 24, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Front bangs */}
      <mesh position={[0, 0.05, 0.4]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Left side */}
      <mesh position={[-0.45, -0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Right side */}
      <mesh position={[0.45, -0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Back hair - wolf cut style (longer, layered) using overlapping pieces for full coverage */}
      {/* Main back panel - covers entire back of head */}
      <mesh position={[0, -0.1, -0.38]}>
        <boxGeometry args={[0.9, 0.6, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Left back connector */}
      <mesh position={[-0.35, -0.05, -0.32]}>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Right back connector */}
      <mesh position={[0.35, -0.05, -0.32]}>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Middle back layer - starts the long wolf cut */}
      <mesh position={[0, -0.35, -0.4]}>
        <boxGeometry args={[0.8, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Lower middle back */}
      <mesh position={[0, -0.6, -0.42]}>
        <boxGeometry args={[0.7, 0.4, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Long tail - signature wolf cut */}
      <mesh position={[0, -0.85, -0.43]}>
        <boxGeometry args={[0.6, 0.45, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Left side tail */}
      <mesh position={[-0.25, -0.55, -0.38]}>
        <boxGeometry args={[0.2, 0.45, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Right side tail */}
      <mesh position={[0.25, -0.55, -0.38]}>
        <boxGeometry args={[0.2, 0.45, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}