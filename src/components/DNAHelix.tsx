import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DNAHelixProps {
  speed?: number;
}

export function DNAHelix({ speed = 0.3 }: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { strandGeometry, rungsGeometry, particleGeometry } = useMemo(() => {
    const strandPoints1: THREE.Vector3[] = [];
    const strandPoints2: THREE.Vector3[] = [];
    const rungPositions: number[] = [];
    const rungColors: number[] = [];
    const particlePositions: number[] = [];

    const turns = 4;
    const pointsPerTurn = 40;
    const totalPoints = turns * pointsPerTurn;
    const height = 8;
    const radius = 1.2;

    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * turns * Math.PI * 2;
      const y = t * height - height / 2;

      strandPoints1.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
      strandPoints2.push(new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      ));

      // Rungs every ~8 points
      if (i % 8 === 0) {
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        rungPositions.push(x1, y, z1, x2, y, z2);

        // Color based on base pair type (AT=cyan, GC=purple)
        const isAT = Math.random() > 0.5;
        const r1 = isAT ? 0 : 0.6;
        const g1 = isAT ? 0.95 : 0.3;
        const b1 = isAT ? 0.98 : 1.0;
        rungColors.push(r1, g1, b1, r1, g1, b1);
      }
    }

    // Ambient particles
    for (let i = 0; i < 200; i++) {
      particlePositions.push(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      );
    }

    // Strand 1
    const curve1 = new THREE.CatmullRomCurve3(strandPoints1);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, totalPoints, 0.06, 6, false);

    // Strand 2
    const curve2 = new THREE.CatmullRomCurve3(strandPoints2);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, totalPoints, 0.06, 6, false);

    // Merge strands
    const merged = new THREE.BufferGeometry();
    const positions = new Float32Array([
      ...tubeGeo1.attributes.position.array,
      ...tubeGeo2.attributes.position.array
    ]);
    merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Rungs
    const rungGeo = new THREE.BufferGeometry();
    rungGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(rungPositions), 3));
    rungGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(rungColors), 3));

    // Particles
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));

    return {
      strandGeometry: { geo1: tubeGeo1, geo2: tubeGeo2 },
      rungsGeometry: rungGeo,
      particleGeometry: partGeo
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 */}
      <mesh geometry={strandGeometry.geo1}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00c8d4"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Strand 2 */}
      <mesh geometry={strandGeometry.geo2}>
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#6d28d9"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Rungs */}
      <lineSegments geometry={rungsGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.7}
          linewidth={2}
        />
      </lineSegments>

      {/* Glow spheres at rung ends */}
      {Array.from({ length: 12 }).map((_, i) => {
        const t = i / 12;
        const turns = 4;
        const angle = t * turns * Math.PI * 2;
        const y = t * 8 - 4;
        const r = 1.2;
        return (
          <group key={i}>
            <mesh position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={2}
              />
            </mesh>
            <mesh position={[Math.cos(angle + Math.PI) * r, y, Math.sin(angle + Math.PI) * r]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color="#a855f7"
                emissive="#a855f7"
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ambient particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.04}
          color="#00f5ff"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
