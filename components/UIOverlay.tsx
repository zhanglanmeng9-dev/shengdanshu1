
import React from 'react';
import { TreeMorphState } from '../types';

interface UIOverlayProps {
  state: TreeMorphState;
  onToggle: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ state, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
      {/* Header with Title and Control Button */}
      <header className="flex flex-col md:flex-row justify-between items-start w-full gap-8 transition-opacity duration-700 delay-300 opacity-100">
        <div className="flex flex-col">
          <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] tracking-widest drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
            ARIX SIGNATURE
          </h1>
          <p className="text-[#0a5c3e] font-light text-sm md:text-base tracking-[0.3em] uppercase mt-2">
            Limited Interactive Edition
          </p>
          <p className="text-[#d4af37]/60 font-light text-xs md:text-sm tracking-[0.2em] italic mt-1">
            to my friends
          </p>
        </div>

        {/* Morph Toggle Button - Moved to top-right */}
        <div className="pointer-events-auto flex flex-col items-end gap-3 self-end md:self-auto">
          <button 
            onClick={onToggle}
            className="group relative px-8 py-3 overflow-hidden rounded-full border border-[#d4af37]/30 transition-all duration-500 hover:border-[#d4af37] hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
          >
            <div className="absolute inset-0 bg-[#043927] opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <span className="font-cinzel text-[#d4af37] text-sm md:text-base tracking-wider">
                {state === TreeMorphState.SCATTERED ? 'ASSEMBLE' : 'SCATTER'}
              </span>
              <div className={`w-2 h-2 rounded-full ${state === TreeMorphState.TREE_SHAPE ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]'}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Footer / Status Area */}
      <footer className="flex flex-col gap-6 w-full">
        {/* Interaction hint in the middle-bottom */}
        <div className="flex flex-col items-center pointer-events-none">
          <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-[0.5em] text-center max-w-xs animate-fade-in">
            Drag to rotate • Scroll to zoom
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[#d4af37]/20" />
            <span className="text-white/20 text-[10px] uppercase tracking-widest">
              Cinematic Render v1.02
            </span>
          </div>
          <div className="text-[#d4af37]/50 font-cinzel text-xs md:text-sm italic">
            &quot;Eternal Bloom of Emerald and Gold&quot;
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UIOverlay;
