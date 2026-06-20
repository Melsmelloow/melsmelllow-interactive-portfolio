import { RigidBody } from "@react-three/rapier";

export default function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#6db36d" />
    </mesh>
    </RigidBody>
  );
}
