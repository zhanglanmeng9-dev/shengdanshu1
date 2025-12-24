
import React from 'react';
import { PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import { TreeMorphState } from '../types';

interface ExperienceProps {
  state: TreeMorphState;
}

const Experience: React.FC<ExperienceProps> = ({ state }) => {
  const progress = state === TreeMorphState.TREE_SHAPE ? 1 : 0;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={40} 
        autoRotate={state === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      <color attach="background" args={['#020f0a']} />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffec8b" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0a5c3e" />
      
      <Environment preset="studio" />

      <group position={[0, -2, 0]}>
        <Foliage progress={progress} />
        <Ornaments progress={progress} />
        
        {state === TreeMorphState.TREE_SHAPE && (
          <ContactShadows 
            opacity={0.4} 
            scale={20} 
            blur={2.4} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
        )}
      </group>

      {/* Fixed: Changed disableNormalPass to enableNormalPass={false} to resolve TS error */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

export default Experience;
