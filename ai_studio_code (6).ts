import React from 'react';
import { VisionMode } from '../types/calculator';
import { Sun, Moon } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  mode: VisionMode;
  onToggle: (mode: VisionMode) => void;
  compact?: boolean;
}

export const VisionModeSwitch: React.FC<Props> = ({ mode, onToggle, compact = false }) => {
  const handleSelect = (newMode: VisionMode) => {
    soundEffects.playKeyClick('special');
    onToggle(newMode);
  };

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1.5'} p-1 bg-black/15 backdrop-blur-sm rounded-xl border border-black/10`}>
      <button
        type="button"
        onClick={() => handleSelect('solar-lemon')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          mode === 'solar-lemon'
            ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400'
            : 'text-neutral-700 hover:text-black hover:bg-black/5 dark:text-neutral-300'
        }`}
        title="Vision Mode 1: Solar Orange & Lemon Yellow"
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Mode 1: Solar Lemon</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('obsidian-cyber')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          mode === 'obsidian-cyber'
            ? 'bg-neutral-900 text-yellow-300 shadow-sm ring-1 ring-yellow-400/40'
            : 'text-neutral-700 hover:text-black hover:bg-black/5 dark:text-neutral-300'
        }`}
        title="Vision Mode 2: Obsidian Cyber & Neon Yellow"
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Mode 2: Obsidian Cyber</span>
      </button>
    </div>
  );
};