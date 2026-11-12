import React, { useState } from 'react';
import { AngleMode, FloatMode, VisionMode } from '../types/calculator';
import { Copy, Check } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  expression: string;
  result: string;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  isSecond: boolean;
  isHyp: boolean;
  hasMemory: boolean;
  floatMode: FloatMode;
  onToggleFloatMode: () => void;
  visionMode: VisionMode;
}

export const Display: React.FC<Props> = ({
  expression,
  result,
  angleMode,
  onToggleAngleMode,
  isSecond,
  isHyp,
  hasMemory,
  floatMode,
  onToggleFloatMode,
  visionMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    soundEffects.playKeyClick('special');
    setTimeout(() => setCopied(false), 1600);
  };

  const isSolar = visionMode === 'solar-lemon';

  return (
    <div
      className={`relative w-full rounded-2xl p-4 transition-all duration-300 border shadow-inner ${
        isSolar
          ? 'bg-[#d8e285] border-[#b0be53] text-[#1a2507] shadow-black/15'
          : 'bg-[#060a12] border-yellow-400/30 text-yellow-300 shadow-yellow-500/10 shadow-lg'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />

      {/* Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider mb-2 relative z-10 border-b pb-1.5 border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playKeyClick('normal');
              onToggleAngleMode();
            }}
            className={`px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
              isSolar ? 'bg-black/10 hover:bg-black/20 text-[#1a2507]' : 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30'
            }`}
          >
            {angleMode}
          </button>

          <span className={`px-1 py-0.2 rounded font-bold transition-opacity ${isSecond ? (isSolar ? 'bg-amber-600 text-white' : 'bg-yellow-400 text-black font-extrabold') : 'opacity-25'}`}>
            2nd
          </span>

          <span className={`px-1 py-0.2 rounded font-bold transition-opacity ${isHyp ? (isSolar ? 'bg-orange-600 text-white' : 'bg-cyan-400 text-black') : 'opacity-25'}`}>
            HYP
          </span>

          <span className={`px-1 py-0.2 rounded font-bold transition-opacity ${hasMemory ? (isSolar ? 'bg-black/15 font-black' : 'text-amber-400 font-black') : 'opacity-20'}`}>
            M
          </span>

          <button
            type="button"
            onClick={() => {
              soundEffects.playKeyClick('normal');
              onToggleFloatMode();
            }}
            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors cursor-pointer ${isSolar ? 'text-black/70 hover:bg-black/10' : 'text-yellow-400/80 hover:bg-yellow-400/10'}`}
          >
            {floatMode}
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium transition-colors cursor-pointer ${isSolar ? 'text-black/70 hover:bg-black/10' : 'text-yellow-400/90 hover:bg-yellow-400/20'}`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Expression */}
      <div className="relative overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth py-1">
        <div className={`font-calc text-right text-sm sm:text-base tracking-wide min-h-[1.5rem] select-all ${isSolar ? 'text-[#2a3810]' : 'text-yellow-200/90'}`}>
          {expression || '0'}
        </div>
      </div>

      {/* Evaluated Result */}
      <div className="relative mt-1 overflow-x-auto whitespace-nowrap scroll-smooth pb-0.5">
        <div className={`font-calc font-bold text-right text-2xl sm:text-4xl tracking-tight select-all tabular-nums ${isSolar ? 'text-[#101804] drop-shadow-sm' : 'text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.45)]'}`}>
          {result || '0'}
        </div>
      </div>
    </div>
  );
};