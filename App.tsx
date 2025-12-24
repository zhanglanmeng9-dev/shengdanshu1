
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import UIOverlay from './components/UIOverlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  const toggleState = () => {
    setTreeState(prev => 
      prev === TreeMorphState.SCATTERED 
        ? TreeMorphState.TREE_SHAPE 
        : TreeMorphState.SCATTERED
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#020f0a] overflow-hidden">
      {/* Loading State Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020f0a]">
          <div className="w-16 h-16 border-t-2 border-[#d4af37] rounded-full animate-spin mb-6" />
          <h2 className="font-cinzel text-[#d4af37] text-xl tracking-widest animate-pulse">
            CRAFTING SIGNATURE EXPERIENCE...
          </h2>
        </div>
      }>
        <Canvas 
          shadows 
          gl={{ 
            antialias: true, 
            stencil: false, 
            depth: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <Experience state={treeState} />
        </Canvas>
      </Suspense>

      {/* UI Overlay Layers */}
      <UIOverlay state={treeState} onToggle={toggleState} />
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#d4af37]/10 pointer-events-none m-4 md:m-8" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#d4af37]/10 pointer-events-none m-4 md:m-8" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#d4af37]/10 pointer-events-none m-4 md:m-8" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#d4af37]/10 pointer-events-none m-4 md:m-8" />
    </div>
  );
};

export default App;
