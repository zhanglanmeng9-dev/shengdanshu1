
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS } from '../constants';
import { generateTreePosition, generateScatterPosition, getRandomRotation } from '../utils';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progress: number;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progress }) => {
  const ballMeshRef = useRef<THREE.InstancedMesh>(null);
  const giftMeshRef = useRef<THREE.InstancedMesh>(null);
  const starMeshRef = useRef<THREE.InstancedMesh>(null);

  const ornaments = useMemo(() => {
    const data: OrnamentData[] = [];
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
      const types: Array<'ball' | 'gift' | 'star'> = ['ball', 'gift', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      data.push({
        id: i,
        type,
        scatterPos: generateScatterPosition(),
        treePos: generateTreePosition(i, CONFIG.ORNAMENT_COUNT),
        scatterRot: getRandomRotation(),
        treeRot: [0, Math.random() * Math.PI, 0],
        scale: type === 'gift' ? 0.3 + Math.random() * 0.4 : 0.15 + Math.random() * 0.2,
        weight: type === 'gift' ? 0.5 : type === 'ball' ? 1.2 : 2.0
      });
    }
    return data;
  }, []);

  const ballIndices = ornaments.filter(o => o.type === 'ball');
  const giftIndices = ornaments.filter(o => o.type === 'gift');
  const starIndices = ornaments.filter(o => o.type === 'star');

  const currentProgress = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, progress, 0.04);
    const t = state.clock.getElapsedTime();

    const updateMesh = (mesh: THREE.InstancedMesh | null, dataSet: OrnamentData[]) => {
      if (!mesh) return;
      dataSet.forEach((o, i) => {
        const p = currentProgress.current;
        // Interpolate position
        const posX = THREE.MathUtils.lerp(o.scatterPos[0], o.treePos[0], p);
        const posY = THREE.MathUtils.lerp(o.scatterPos[1], o.treePos[1], p);
        const posZ = THREE.MathUtils.lerp(o.scatterPos[2], o.treePos[2], p);

        // Physics-like floating when scattered
        const floatAmp = (1.0 - p) * 0.5 * o.weight;
        const floatX = Math.sin(t * 0.5 * o.weight + o.id) * floatAmp;
        const floatY = Math.cos(t * 0.3 * o.weight + o.id) * floatAmp;

        dummy.position.set(posX + floatX, posY + floatY, posZ);
        
        // Interpolate rotation
        dummy.rotation.set(
          THREE.MathUtils.lerp(o.scatterRot[0] + t * 0.1 * o.weight, o.treeRot[0], p),
          THREE.MathUtils.lerp(o.scatterRot[1] + t * 0.2 * o.weight, o.treeRot[1], p),
          THREE.MathUtils.lerp(o.scatterRot[2], o.treeRot[2], p)
        );

        dummy.scale.setScalar(o.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(ballMeshRef.current, ballIndices);
    updateMesh(giftMeshRef.current, giftIndices);
    updateMesh(starMeshRef.current, starIndices);
  });

  return (
    <group>
      {/* Balls - Metallic Gold */}
      <instancedMesh ref={ballMeshRef} args={[undefined, undefined, ballIndices.length]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={COLORS.goldRich} 
          metalness={0.9} 
          roughness={0.1}
          emissive={COLORS.goldHighlight}
          emissiveIntensity={0.2}
        />
      </instancedMesh>

      {/* Gifts - Deep Emerald Boxes */}
      <instancedMesh ref={giftMeshRef} args={[undefined, undefined, giftIndices.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={COLORS.emeraldBright} 
          metalness={0.4} 
          roughness={0.5} 
        />
      </instancedMesh>

      {/* Stars - Glowing small lights */}
      <instancedMesh ref={starMeshRef} args={[undefined, undefined, starIndices.length]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={COLORS.goldHighlight} 
          emissive={COLORS.goldHighlight} 
          emissiveIntensity={2.0} 
        />
      </instancedMesh>
    </group>
  );
};

export default Ornaments;
