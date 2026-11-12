/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AngleMode, FloatMode, HistoryItem, VisionMode, ConstantItem } from './types/calculator';
import { evaluateExpression, formatResult } from './utils/mathEngine';
import { soundEffects } from './utils/audio';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryPanel } from './components/HistoryPanel';
import { ConstantsModal } from './components/ConstantsModal';
import { VisionModeSwitch } from './components/VisionModeSwitch';
import {
  Volume2,
  VolumeX,
  History,
  BookOpen,
  Keyboard,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [visionMode, setVisionMode] = useState<VisionMode>('solar-lemon');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [floatMode, setFloatMode] = useState<FloatMode>('NORM');
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [isHyp, setIsHyp] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [prevAns, setPrevAns] = useState<number>(0);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sana_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConstants, setShowConstants] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (visionMode === 'obsidian-cyber') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [visionMode]);

  useEffect(() => {
    try {
      localStorage.setItem('sana_calc_history', JSON.stringify(history.slice(0, 50)));
    } catch {
      // Ignore
    }
  }, [history]);

  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResult('0');
      return;
    }
    try {
      const val = evaluateExpression(expression, angleMode, prevAns);
      setResult(formatResult(val, floatMode));
    } catch {
      // Typing incomplete
    }
  }, [expression, angleMode, floatMode, prevAns]);

  const handleInput = useCallback((char: string) => {
    setExpression((prev) => {
      if (prev === 'Error' || prev === 'Syntax error') return char;
      return prev + char;
    });
  }, []);

  const handleDelete = useCallback(() => {
    setExpression((prev) => {
      if (prev.length <= 1) return '';
      const fnMatches = [
        'asinh(', 'acosh(', 'atanh(', 'sinh(', 'cosh(', 'tanh(',
        'asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(',
        'log(', 'ln(', 'sqrt(', 'cbrt(', 'abs(', 'mod ', 'nCr ', 'nPr ', 'Ans'
      ];
      for (const fn of fnMatches) {
        if (prev.endsWith(fn)) return prev.slice(0, -fn.length);
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setIsSecond(false);
    setIsHyp(false);
  }, []);

  const handleEvaluate = useCallback(() => {
    if (!expression || expression.trim() === '') return;
    try {
      const val = evaluateExpression(expression, angleMode, prevAns);
      const formatted = formatResult(val, floatMode);
      setResult(formatted);
      setPrevAns(val);

      const newEntry: HistoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        expression: expression,
        result: formatted,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 49)]);
      setExpression(formatted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setResult(msg);
    }
  }, [expression, angleMode, prevAns, floatMode]);

  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      let currentVal = 0;
      try {
        currentVal = expression ? evaluateExpression(expression, angleMode, prevAns) : prevAns;
      } catch {
        currentVal = prevAns;
      }

      switch (action) {
        case 'MC': setMemory(0); break;
        case 'MR': setExpression((prev) => prev + memory.toString()); break;
        case 'M+': setMemory((m) => m + currentVal); break;
        case 'M-': setMemory((m) => m - currentVal); break;
        case 'MS': setMemory(currentVal); break;
      }
    },
    [expression, angleMode, prevAns, memory]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '0' && e.key <= '9') {
        soundEffects.playKeyClick('normal');
        handleInput(e.key);
      } else if (e.key === '.') {
        soundEffects.playKeyClick('normal');
        handleInput('.');
      } else if (e.key === '+') {
        soundEffects.playKeyClick('normal');
        handleInput('+');
      } else if (e.key === '-') {
        soundEffects.playKeyClick('normal');
        handleInput('−');
      } else if (e.key === '*') {
        soundEffects.playKeyClick('normal');
        handleInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        soundEffects.playKeyClick('normal');
        handleInput('÷');
      } else if (e.key === '(' || e.key === ')') {
        soundEffects.playKeyClick('normal');
        handleInput(e.key);
      } else if (e.key === '^') {
        soundEffects.playKeyClick('normal');
        handleInput('^');
      } else if (e.key === '!' || e.key === '%') {
        soundEffects.playKeyClick('normal');
        handleInput(e.key);
      } else if (e.key === 'p' || e.key === 'P') {
        soundEffects.playKeyClick('normal');
        handleInput('π');
      } else if (e.key === 'e' || e.key === 'E') {
        soundEffects.playKeyClick('normal');
        handleInput('e');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        soundEffects.playEnter();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        soundEffects.playKeyClick('special');
        handleDelete();
      } else if (e.key === 'Escape') {
        soundEffects.playKeyClick('action');
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleEvaluate, handleDelete, handleClear]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playKeyClick('special');
  };

  const isSolar = visionMode === 'solar-lemon';

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex flex-col font-sans relative ${
        isSolar
          ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-neutral-900'
          : 'bg-gradient-to-br from-[#070b14] via-[#0d1424] to-[#080d1a] text-yellow-100'
      }`}
    >
      <div
        className={`absolute inset-0 pointer-events-none opacity-15 ${
          isSolar
            ? 'bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]'
            : 'bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]'
        }`}
      />

      <header
        className={`relative z-20 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors ${
          isSolar
            ? 'bg-orange-600/60 border-orange-400/30 text-white'
            : 'bg-neutral-950/70 border-yellow-500/20 text-yellow-300'
        }`}
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg sm:text-xl font-tech font-bold tracking-tight whitespace-nowrap">
            Sana Scientific Calculator
          </span>
          <span
            className={`hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isSolar ? 'bg-yellow-300 text-neutral-950' : 'bg-yellow-400/20 text-yellow-300'
            }`}
          >
            SC-991 PRO
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setShowConstants(true)}
            className="flex items-center gap-1.5 hover:underline whitespace-nowrap cursor-pointer opacity-90 hover:opacity-100"
          >
            <BookOpen className="w-4 h-4" />
            <span>Constants</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="flex items-center gap-1.5 hover:underline whitespace-nowrap cursor-pointer opacity-90 hover:opacity-100"
          >
            <History className="w-4 h-4" />
            <span>Tape ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShortcuts((prev) => !prev)}
            className="flex items-center gap-1.5 hover:underline whitespace-nowrap cursor-pointer opacity-90 hover:opacity-100"
          >
            <Keyboard className="w-4 h-4" />
            <span>Keymap</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-1.5 hover:underline whitespace-nowrap cursor-pointer opacity-90 hover:opacity-100"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound {soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <VisionModeSwitch mode={visionMode} onToggle={(m) => setVisionMode(m)} />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
          {/* CALCULATOR BODY */}
          <div
            className={`w-full max-w-md sm:max-w-lg rounded-3xl p-5 sm:p-6 transition-all duration-300 relative shadow-2xl border-4 ${
              isSolar
                ? 'bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#eab308] border-[#ca8a04] shadow-black/25 text-neutral-900 ring-2 ring-yellow-200/50'
                : 'bg-gradient-to-b from-[#fde047] via-[#facc15] to-[#ca8a04] border-yellow-300 shadow-[0_20px_50px_rgba(250,204,21,0.2)] text-neutral-950 ring-2 ring-yellow-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-tech text-base sm:text-lg font-black tracking-tight text-neutral-900 flex items-center gap-1.5">
                  SANA
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/15 text-black font-bold uppercase tracking-widest">
                    SCIENTIFIC
                  </span>
                </span>
                <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-800">
                  TWO WAY POWER // NATURAL DISPLAY
                </span>
              </div>

              {/* Photovoltaic Solar Cells */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 shadow-inner">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((cell) => (
                    <div
                      key={cell}
                      className="w-2.5 sm:w-3 h-5 sm:h-6 bg-gradient-to-b from-[#312e81] via-[#1e1b4b] to-[#0f172a] border border-neutral-600/60 rounded-[1px] relative overflow-hidden"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                    </div>
                  ))}
                </div>
                <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-tighter leading-tight flex flex-col">
                  <span>SOLAR</span>
                  <span className="text-amber-400">CELL</span>
                </div>
              </div>
            </div>

            <Display
              expression={expression}
              result={result}
              angleMode={angleMode}
              onToggleAngleMode={() => setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))}
              isSecond={isSecond}
              isHyp={isHyp}
              hasMemory={memory !== 0}
              floatMode={floatMode}
              onToggleFloatMode={() =>
                setFloatMode((prev) => (prev === 'NORM' ? 'SCI' : prev === 'SCI' ? 'FIX2' : 'NORM'))
              }
              visionMode={visionMode}
            />

            <div className="flex items-center justify-between mt-2.5 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-800">Vision Mode:</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/10 text-neutral-900">
                  {isSolar ? '1: Solar Lemon' : '2: Obsidian Cyber'}
                </span>
              </div>

              <div className="flex md:hidden items-center gap-1">
                <button type="button" onClick={() => setShowConstants(true)} className="px-2 py-0.5 rounded bg-black/10 text-[10px] font-bold">Const</button>
                <button type="button" onClick={() => setShowHistory((prev) => !prev)} className="px-2 py-0.5 rounded bg-black/10 text-[10px] font-bold">Tape</button>
                <button type="button" onClick={toggleSound} className="p-1 rounded bg-black/10 text-neutral-900">
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <Keypad
              onInput={handleInput}
              onClear={handleClear}
              onDelete={handleDelete}
              onEvaluate={handleEvaluate}
              isSecond={isSecond}
              onToggleSecond={() => setIsSecond((prev) => !prev)}
              isHyp={isHyp}
              onToggleHyp={() => setIsHyp((prev) => !prev)}
              onMemoryAction={handleMemoryAction}
              hasMemory={memory !== 0}
              visionMode={visionMode}
            />

            <div className="text-center mt-3 pt-2 border-t border-black/10">
              <span className="text-[10px] font-mono font-semibold text-neutral-800 tracking-wider">
                SANA SCIENTIFIC COMPUTING // 2-VISION MODES // 64-BIT PRECISION
              </span>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            {showHistory ? (
              <HistoryPanel
                history={history}
                onSelect={(item, recallType) => {
                  if (recallType === 'expression') setExpression(item.expression);
                  else setExpression((prev) => prev + item.result);
                }}
                onClear={() => setHistory([])}
                onClose={() => setShowHistory(false)}
                visionMode={visionMode}
              />
            ) : (
              <div
                className={`rounded-2xl p-5 border transition-all shadow-lg ${
                  isSolar ? 'bg-amber-100/85 border-amber-300/80 text-neutral-900' : 'bg-neutral-900/90 border-yellow-500/30 text-yellow-100'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                    <h3 className="font-semibold text-sm font-tech">Device Features</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    className="text-xs text-amber-700 dark:text-yellow-300 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    Open Tape
                  </button>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-yellow-300 block mb-0.5">
                      Two Calibrated Vision Modes
                    </span>
                    <p className="opacity-80 leading-relaxed text-[11px]">
                      {isSolar
                        ? 'Active Mode 1: Solar Citrus — high-contrast radiant Orange background paired with Lemon Yellow calculator chassis and vintage olive LCD.'
                        : 'Active Mode 2: Obsidian Cyber — deep dark studio obsidian field paired with Cyber Lemon Yellow chassis and luminous neon OLED display.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="font-semibold text-neutral-800 dark:text-yellow-300 block mb-0.5">
                      Scientific Capabilities
                    </span>
                    <ul className="space-y-1 opacity-80 text-[11px] list-disc list-inside">
                      <li>Trig & Inverse: sin, cos, tan, asin, acos, atan</li>
                      <li>Hyperbolic: sinh, cosh, tanh (HYP button)</li>
                      <li>Logarithms & Powers: ln, log, eˣ, 10ˣ, xʸ, √, ∛</li>
                      <li>Combinatorics: Factorials (n!), nCr, nPr</li>
                      <li>Constants: π, e, φ & Physical constants</li>
                      <li>Full Memory: MC, MR, M+, M-, MS</li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConstants(true)}
                      className={`flex-1 py-1.5 rounded-xl font-medium text-center text-xs transition-colors cursor-pointer ${
                        isSolar ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-semibold'
                      }`}
                    >
                      Constants Library
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowShortcuts(true)}
                      className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs cursor-pointer"
                    >
                      <Keyboard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConstantsModal
        isOpen={showConstants}
        onClose={() => setShowConstants(false)}
        onSelect={(c: ConstantItem) => handleInput(c.value.toString())}
        visionMode={visionMode}
      />

      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-5 border shadow-2xl ${isSolar ? 'bg-amber-50 text-neutral-900 border-amber-300' : 'bg-neutral-900 text-yellow-100 border-yellow-500/30'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <h3 className="font-bold text-sm font-tech">Hardware Keyboard Shortcuts</h3>
              <button type="button" onClick={() => setShowShortcuts(false)} className="text-xs px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
                Close
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">0 - 9</span><span className="block text-[11px] opacity-75 font-sans">Number inputs</span></div>
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">+ - * /</span><span className="block text-[11px] opacity-75 font-sans">Operators</span></div>
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">Enter / =</span><span className="block text-[11px] opacity-75 font-sans">Evaluate</span></div>
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">Backspace</span><span className="block text-[11px] opacity-75 font-sans">Delete</span></div>
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">Escape</span><span className="block text-[11px] opacity-75 font-sans">All Clear (AC)</span></div>
              <div className="p-2 rounded bg-black/5 dark:bg-white/5"><span className="font-bold text-amber-600 dark:text-yellow-400">p / e / ^</span><span className="block text-[11px] opacity-75 font-sans">Pi, Euler's, Power</span></div>
            </div>
          </div>
        </div>
      )}

      <footer
        className={`py-3 px-6 text-center text-xs border-t transition-colors ${
          isSolar ? 'border-orange-400/30 text-white/80 bg-orange-700/40' : 'border-yellow-500/10 text-yellow-300/60 bg-neutral-950/60'
        }`}
      >
        <span>Sana Scientific Calculator · Vision Mode Engine · Solar Orange & Lemon Yellow Edition</span>
      </footer>
    </div>
  );
}