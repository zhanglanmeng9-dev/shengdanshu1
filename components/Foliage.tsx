
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS } from '../constants';
import { generateTreePosition, generateScatterPosition } from '../utils';

interface FoliageProps {
  progress: number;
}

const Foliage: React.FC<FoliageProps> = ({ progress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, scatterPositions, treePositions, phases } = useMemo(() => {
    const pos = new Float32Array(CONFIG.FOLIAGE_COUNT * 3);
    const scat = new Float32Array(CONFIG.FOLIAGE_COUNT * 3);
    const tree = new Float32Array(CONFIG.FOLIAGE_COUNT * 3);
    const pha = new Float32Array(CONFIG.FOLIAGE_COUNT);
    
    for (let i = 0; i < CONFIG.FOLIAGE_COUNT; i++) {
      const sPos = generateScatterPosition();
      const tPos = generateTreePosition(i, CONFIG.FOLIAGE_COUNT);
      
      scat[i * 3] = sPos[0];
      scat[i * 3 + 1] = sPos[1];
      scat[i * 3 + 2] = sPos[2];
      
      tree[i * 3] = tPos[0];
      tree[i * 3 + 1] = tPos[1];
      tree[i * 3 + 2] = tPos[2];
      
      pha[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions: pos, scatterPositions: scat, treePositions: tree, phases: pha };
  }, []);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorEmerald: { value: new THREE.Color(COLORS.emeraldDeep) },
      uColorGold: { value: new THREE.Color(COLORS.goldRich) },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uProgress;
      attribute vec3 scatterPos;
      attribute vec3 treePos;
      attribute float phase;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Linear interpolation between scattered and tree shape
        vec3 targetPos = mix(scatterPos, treePos, uProgress);
        
        // Add breathing/fluttering effect
        float flutter = sin(uTime + phase) * 0.15;
        targetPos.x += flutter * (1.0 - uProgress * 0.5);
        targetPos.y += cos(uTime * 0.5 + phase) * 0.1;
        
        vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
        gl_PointSize = 2.5 * (30.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        // Color logic: gold tips when in tree shape, otherwise deep emerald
        float goldMix = smoothstep(0.4, 1.0, uProgress) * 0.3;
        vColor = mix(vec3(0.015, 0.22, 0.15), vec3(0.83, 0.68, 0.21), goldMix);
        vAlpha = 0.8 + 0.2 * sin(uTime * 2.0 + phase);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        float strength = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(vColor, strength * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smoothly approach target progress
      material.uniforms.uProgress.value = THREE.MathUtils.lerp(
        material.uniforms.uProgress.value,
        progress,
        0.05
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scatterPos"
          count={scatterPositions.length / 3}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-treePos"
          count={treePositions.length / 3}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={phases.length}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial args={[shaderArgs]} />
    </points>
  );
};

export default Foliage;
