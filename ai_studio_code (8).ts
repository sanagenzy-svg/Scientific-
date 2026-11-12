import React from 'react';
import { VisionMode } from '../types/calculator';
import { Delete } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  onInput: (char: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEvaluate: () => void;
  isSecond: boolean;
  onToggleSecond: () => void;
  isHyp: boolean;
  onToggleHyp: () => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  hasMemory: boolean;
  visionMode: VisionMode;
}

export const Keypad: React.FC<Props> = ({
  onInput,
  onClear,
  onDelete,
  onEvaluate,
  isSecond,
  onToggleSecond,
  isHyp,
  onToggleHyp,
  onMemoryAction,
  hasMemory,
  visionMode,
}) => {
  const isSolar = visionMode === 'solar-lemon';

  const press = (fn: () => void, type: 'normal' | 'action' | 'special' = 'normal') => {
    soundEffects.playKeyClick(type);
    fn();
  };

  const baseKeyStyle =
    'relative flex flex-col items-center justify-center rounded-xl font-medium transition-all duration-150 active:scale-95 active:translate-y-0.5 cursor-pointer shadow-sm select-none';

  const sciKeyStyle = isSolar
    ? 'bg-neutral-800 text-yellow-100 hover:bg-neutral-700 active:bg-neutral-900 border-b-2 border-neutral-950 text-xs sm:text-sm py-2 sm:py-2.5'
    : 'bg-neutral-900 text-yellow-300 hover:bg-neutral-800 active:bg-neutral-950 border border-yellow-500/20 text-xs sm:text-sm py-2 sm:py-2.5';

  const numKeyStyle = isSolar
    ? 'bg-white text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 border-b-2 border-amber-200 font-calc font-semibold text-base sm:text-lg py-2.5 sm:py-3 shadow-md'
    : 'bg-neutral-800 text-yellow-200 hover:bg-neutral-700 active:bg-neutral-900 border-b-2 border-neutral-950 font-calc font-semibold text-base sm:text-lg py-2.5 sm:py-3 shadow-md';

  const opKeyStyle = isSolar
    ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 border-b-2 border-orange-700 font-semibold text-base sm:text-lg py-2.5 sm:py-3 shadow-md'
    : 'bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 border-b-2 border-amber-800 font-semibold text-base sm:text-lg py-2.5 sm:py-3 shadow-md';

  const memKeyStyle = isSolar
    ? 'bg-amber-200/80 text-amber-950 hover:bg-amber-300 active:bg-amber-400 text-[11px] font-bold py-1.5 rounded-lg border border-amber-400/40'
    : 'bg-yellow-950/60 text-yellow-400 hover:bg-yellow-900/60 active:bg-yellow-900 text-[11px] font-bold py-1.5 rounded-lg border border-yellow-600/30';

  return (
    <div className="w-full flex flex-col gap-2 mt-3">
      {/* Memory Bar */}
      <div className="grid grid-cols-5 gap-1.5">
        <button type="button" onClick={() => press(() => onMemoryAction('MC'), 'special')} className={`${memKeyStyle} ${!hasMemory ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!hasMemory}>MC</button>
        <button type="button" onClick={() => press(() => onMemoryAction('MR'), 'special')} className={`${memKeyStyle} ${!hasMemory ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!hasMemory}>MR</button>
        <button type="button" onClick={() => press(() => onMemoryAction('M+'), 'special')} className={memKeyStyle}>M+</button>
        <button type="button" onClick={() => press(() => onMemoryAction('M-'), 'special')} className={memKeyStyle}>M-</button>
        <button type="button" onClick={() => press(() => onMemoryAction('MS'), 'special')} className={memKeyStyle}>MS</button>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => press(onToggleSecond, 'special')}
          className={`${baseKeyStyle} ${isSecond ? 'bg-amber-600 text-white font-bold ring-2 ring-white shadow-lg' : isSolar ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold' : 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold'} py-2 sm:py-2.5 text-xs sm:text-sm border-b-2 border-amber-700/60`}
        >
          <span className="text-[9px] uppercase tracking-wider text-amber-900/70 dark:text-black/60">Shift</span>
          <span>2nd</span>
        </button>
        <button
          type="button"
          onClick={() => press(onToggleHyp, 'special')}
          className={`${baseKeyStyle} ${isHyp ? 'bg-orange-600 text-white font-bold ring-2 ring-white shadow-lg' : isSolar ? 'bg-amber-300/90 text-amber-950 hover:bg-amber-200 font-semibold' : 'bg-yellow-600/50 text-yellow-200 hover:bg-yellow-600 font-semibold'} py-2 sm:py-2.5 text-xs sm:text-sm border-b-2 border-amber-600/40`}
        >
          <span className="text-[9px] uppercase tracking-wider opacity-60">Trig</span>
          <span>HYP</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('('), 'normal')} className={`${baseKeyStyle} ${sciKeyStyle}`}>(</button>
        <button type="button" onClick={() => press(() => onInput(')'), 'normal')} className={`${baseKeyStyle} ${sciKeyStyle}`}>)</button>
        <button type="button" onClick={() => press(onDelete, 'special')} className={`${baseKeyStyle} ${isSolar ? 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 border-b-2 border-amber-900' : 'bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800 border-b-2 border-amber-950'} py-2 sm:py-2.5 font-bold text-xs sm:text-sm`}>
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => { if (isHyp) onInput(isSecond ? 'asinh(' : 'sinh('); else onInput(isSecond ? 'asin(' : 'sin('); })} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isHyp ? (isSecond ? 'asinh' : 'sinh') : isSecond ? 'sin⁻¹' : 'sin'}</span>
          <span>{isHyp ? (isSecond ? 'asinh' : 'sinh') : isSecond ? 'asin' : 'sin'}</span>
        </button>
        <button type="button" onClick={() => press(() => { if (isHyp) onInput(isSecond ? 'acosh(' : 'cosh('); else onInput(isSecond ? 'acos(' : 'cos('); })} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isHyp ? (isSecond ? 'acosh' : 'cosh') : isSecond ? 'cos⁻¹' : 'cos'}</span>
          <span>{isHyp ? (isSecond ? 'acosh' : 'cosh') : isSecond ? 'acos' : 'cos'}</span>
        </button>
        <button type="button" onClick={() => press(() => { if (isHyp) onInput(isSecond ? 'atanh(' : 'tanh('); else onInput(isSecond ? 'atan(' : 'tan('); })} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isHyp ? (isSecond ? 'atanh' : 'tanh') : isSecond ? 'tan⁻¹' : 'tan'}</span>
          <span>{isHyp ? (isSecond ? 'atanh' : 'tanh') : isSecond ? 'atan' : 'tan'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? 'e' : 'π'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? 'e' : 'π'}</span>
          <span>{isSecond ? 'e' : 'π'}</span>
        </button>
        <button type="button" onClick={() => press(onClear, 'action')} className={`${baseKeyStyle} ${isSolar ? 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border-b-2 border-rose-900' : 'bg-rose-700 text-white hover:bg-rose-600 active:bg-rose-800 border-b-2 border-rose-950'} py-2 sm:py-2.5 font-bold text-xs sm:text-sm`}>
          AC
        </button>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput(isSecond ? 'e^(' : 'ln('))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? 'eˣ' : 'ln'}</span>
          <span>{isSecond ? 'eˣ' : 'ln'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? '10^(' : 'log('))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? '10ˣ' : 'log'}</span>
          <span>{isSecond ? '10ˣ' : 'log'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? '^3' : '^2'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? 'x³' : 'x²'}</span>
          <span>{isSecond ? 'x³' : 'x²'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('^'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">xʸ</span>
          <span>xʸ</span>
        </button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? '∛(' : '√('))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? '∛' : '√'}</span>
          <span>{isSecond ? '∛' : '√'}</span>
        </button>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput('!'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">n!</span>
          <span>x!</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('^( -1 )'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">1/x</span>
          <span>1/x</span>
        </button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? ' nPr ' : ' nCr '))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? 'nPr' : 'nCr'}</span>
          <span>{isSecond ? 'nPr' : 'nCr'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('abs('))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">|x|</span>
          <span>abs</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('÷'))} className={`${baseKeyStyle} ${opKeyStyle}`}>÷</button>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput('7'))} className={`${baseKeyStyle} ${numKeyStyle}`}>7</button>
        <button type="button" onClick={() => press(() => onInput('8'))} className={`${baseKeyStyle} ${numKeyStyle}`}>8</button>
        <button type="button" onClick={() => press(() => onInput('9'))} className={`${baseKeyStyle} ${numKeyStyle}`}>9</button>
        <button type="button" onClick={() => press(() => onInput(isSecond ? ' mod ' : '%'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">{isSecond ? 'mod' : '%'}</span>
          <span>{isSecond ? 'mod' : '%'}</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('×'))} className={`${baseKeyStyle} ${opKeyStyle}`}>×</button>
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput('4'))} className={`${baseKeyStyle} ${numKeyStyle}`}>4</button>
        <button type="button" onClick={() => press(() => onInput('5'))} className={`${baseKeyStyle} ${numKeyStyle}`}>5</button>
        <button type="button" onClick={() => press(() => onInput('6'))} className={`${baseKeyStyle} ${numKeyStyle}`}>6</button>
        <button type="button" onClick={() => press(() => onInput('Ans'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">Prev</span>
          <span>Ans</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('−'))} className={`${baseKeyStyle} ${opKeyStyle}`}>−</button>
      </div>

      {/* Row 7 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput('1'))} className={`${baseKeyStyle} ${numKeyStyle}`}>1</button>
        <button type="button" onClick={() => press(() => onInput('2'))} className={`${baseKeyStyle} ${numKeyStyle}`}>2</button>
        <button type="button" onClick={() => press(() => onInput('3'))} className={`${baseKeyStyle} ${numKeyStyle}`}>3</button>
        <button type="button" onClick={() => press(() => onInput('E'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">×10ˣ</span>
          <span>EXP</span>
        </button>
        <button type="button" onClick={() => press(() => onInput('+'))} className={`${baseKeyStyle} ${opKeyStyle}`}>+</button>
      </div>

      {/* Row 8 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button type="button" onClick={() => press(() => onInput('0'))} className={`${baseKeyStyle} ${numKeyStyle}`}>0</button>
        <button type="button" onClick={() => press(() => onInput('.'))} className={`${baseKeyStyle} ${numKeyStyle}`}>.</button>
        <button type="button" onClick={() => press(() => onInput('−'))} className={`${baseKeyStyle} ${numKeyStyle}`}>( - )</button>
        <button type="button" onClick={() => press(() => onInput('φ'))} className={`${baseKeyStyle} ${sciKeyStyle}`}>
          <span className="text-[9px] text-amber-400 font-mono">1.618</span>
          <span>φ</span>
        </button>
        <button
          type="button"
          onClick={() => {
            soundEffects.playEnter();
            onEvaluate();
          }}
          className={`${baseKeyStyle} ${isSolar ? 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 border-b-2 border-amber-700 font-black text-xl shadow-lg ring-1 ring-amber-300' : 'bg-yellow-400 text-neutral-950 hover:bg-yellow-300 active:bg-yellow-500 border-b-2 border-yellow-600 font-black text-xl shadow-lg ring-1 ring-yellow-300'}`}
        >
          =
        </button>
      </div>
    </div>
  );
};