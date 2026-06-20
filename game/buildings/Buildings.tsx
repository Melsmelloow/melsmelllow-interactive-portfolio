export default function Buildings() {
  return (
    <>
      {/* House */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#c58c5a" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.8, 1, 4]} />
        <meshStandardMaterial color="#8b3a3a" />
      </mesh>
    </>
  );
}
