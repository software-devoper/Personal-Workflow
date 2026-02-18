import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function NeuralMesh() {
  const groupRef = useRef();
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i += 1) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radius = 1.8 + Math.random() * 0.2;
      p.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    return p;
  }, []);

  const edges = useMemo(() => {
    const lineSet = [];
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        if (points[i].distanceTo(points[j]) < 1.25) {
          lineSet.push([points[i], points[j]]);
        }
      }
    }
    return lineSet;
  }, [points]);

  useFrame((state) => {
    const { pointer } = state;
    groupRef.current.rotation.y += 0.0025;
    groupRef.current.rotation.x = pointer.y * 0.3;
    groupRef.current.rotation.z = pointer.x * 0.2;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            itemSize={3}
            array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          />
        </bufferGeometry>
        <pointsMaterial color="#67e8f9" size={0.05} sizeAttenuation transparent opacity={0.9} />
      </points>

      {edges.map((edge, index) => (
        <Line key={index} points={edge} color="#22d3ee" lineWidth={0.6} transparent opacity={0.35} />
      ))}
    </group>
  );
}

export default function NeuralSphere() {
  return (
    <div className="h-[350px] w-full rounded-2xl border border-cyan-300/25 bg-slate-900/50 shadow-neon sm:h-[420px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={1.2} color="#22d3ee" />
        <NeuralMesh />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
