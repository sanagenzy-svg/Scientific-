import React, { useState } from 'react';
import { ConstantItem, VisionMode } from '../types/calculator';
import { SCIENTIFIC_CONSTANTS } from '../utils/constants';
import { X, Search, Check } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (c: ConstantItem) => void;
  visionMode: VisionMode;
}

export const ConstantsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  visionMode,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [insertedSymbol, setInsertedSymbol] = useState<string | null>(null);

  if (!isOpen) return null;
  const isSolar = visionMode === 'solar-lemon';
  const categories = ['All', 'Math', 'Physics', 'Chemistry', 'Universal'];

  const filtered = SCIENTIFIC_CONSTANTS.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePick = (item: ConstantItem) => {
    soundEffects.playKeyClick('special');
    onSelect(item);
    setInsertedSymbol(item.symbol);
    setTimeout(() => {
      setInsertedSymbol(null);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-2xl p-5 border shadow-2xl flex flex-col max-h-[85vh] ${
          isSolar ? 'bg-amber-50 border-amber-300 text-neutral-900' : 'bg-neutral-900 border-yellow-500/30 text-yellow-100'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold font-tech tracking-wide">Scientific Constants Library</h2>
            <p className="text-xs opacity-75">Click any constant to insert its numerical value</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search constants (e.g. Planck, c, gravity, pi)..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border outline-none font-sans ${
                isSolar ? 'bg-white border-amber-200 focus:border-amber-500 text-neutral-900' : 'bg-neutral-800 border-neutral-700 focus:border-yellow-400 text-yellow-100'
              }`}
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? isSolar ? 'bg-amber-500 text-white shadow-sm' : 'bg-yellow-400 text-neutral-950 font-semibold'
                    : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs opacity-60">No constants matching "{search}"</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.symbol + item.name}
                type="button"
                onClick={() => handlePick(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                  isSolar ? 'bg-white/90 hover:bg-white border-amber-200 hover:border-amber-400' : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-calc font-bold text-sm ${isSolar ? 'bg-amber-100 text-amber-950' : 'bg-neutral-900 text-yellow-300'}`}>
                    {item.symbol}
                  </div>
                  <div>
                    <div className="font-semibold text-xs">{item.name}</div>
                    <div className="text-[11px] font-mono opacity-70">
                      {item.value.toExponential(5)} <span className="opacity-60">{item.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70">
                    {item.category}
                  </span>
                  {insertedSymbol === item.symbol && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};