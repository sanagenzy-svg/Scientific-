import React from 'react';
import { HistoryItem, VisionMode } from '../types/calculator';
import { Trash2, CornerDownLeft, Clock, X } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem, recallType: 'expression' | 'result') => void;
  onClear: () => void;
  onClose: () => void;
  visionMode: VisionMode;
}

export const HistoryPanel: React.FC<Props> = ({
  history,
  onSelect,
  onClear,
  onClose,
  visionMode,
}) => {
  const isSolar = visionMode === 'solar-lemon';

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 border flex flex-col h-full max-h-[580px] shadow-xl ${
        isSolar ? 'bg-amber-100/90 border-amber-300 text-neutral-900' : 'bg-neutral-900/95 border-yellow-500/30 text-yellow-100'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
          <h3 className="font-semibold text-sm tracking-wide">Tape History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-mono">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playKeyClick('special');
                onClear();
              }}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/15 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1">
        {history.length === 0 ? (
          <div className="text-center py-12 text-xs opacity-60">
            No calculations recorded yet.<br />
            Evaluate an expression to see tape entries here.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border transition-all text-xs font-calc group ${
                isSolar ? 'bg-white/80 hover:bg-white border-amber-200 shadow-sm' : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700'
              }`}
            >
              <div
                onClick={() => {
                  soundEffects.playKeyClick('normal');
                  onSelect(item, 'expression');
                }}
                className="text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline truncate"
              >
                {item.expression}
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/5 dark:border-white/5">
                <span
                  onClick={() => {
                    soundEffects.playKeyClick('normal');
                    onSelect(item, 'result');
                  }}
                  className="font-bold text-sm text-neutral-900 dark:text-yellow-300 cursor-pointer hover:underline truncate"
                >
                  = {item.result}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playKeyClick('normal');
                    onSelect(item, 'result');
                  }}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-black/5 dark:bg-white/10 transition-opacity cursor-pointer"
                >
                  <CornerDownLeft className="w-3 h-3" />
                  Recall
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};