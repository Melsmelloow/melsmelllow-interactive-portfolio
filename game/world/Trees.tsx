export default function Trees() {
  return (
    <>
      {/* trunk */}
      <mesh position={[-5, 1, -5]}>
        <cylinderGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* leaves */}
      <mesh position={[-5, 2.5, -5]}>
        <sphereGeometry args={[1]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </>
  );
}