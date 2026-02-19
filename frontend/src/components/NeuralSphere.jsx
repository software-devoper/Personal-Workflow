import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function HolographicCube() {
  const groupRef = useRef();

  useFrame((state) => {
    const { pointer } = state;
    groupRef.current.rotation.y += 0.008;
    groupRef.current.rotation.x = pointer.y * 0.28 + 0.2;
    groupRef.current.rotation.z = pointer.x * 0.2;
  });

  return (
    <group ref={groupRef} scale={1.2}>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.08} emissive="#22d3ee" emissiveIntensity={0.55} />
        <Edges threshold={15} color="#67e8f9" />
      </mesh>
      <mesh scale={1.23}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export default function NeuralSphere() {
  return (
    <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[380px]">
      <Canvas camera={{ position: [0, 0, 5.6], fov: 50 }}>
        <ambientLight intensity={0.65} />
        <pointLight position={[3, 3, 4]} intensity={1.35} color="#22d3ee" />
        <pointLight position={[-3, -2, -2]} intensity={0.7} color="#0ea5e9" />
        <HolographicCube />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
