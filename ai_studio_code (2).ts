export type VisionMode = 'solar-lemon' | 'obsidian-cyber';

export type AngleMode = 'DEG' | 'RAD';

export type FloatMode = 'NORM' | 'SCI' | 'FIX2';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ConstantItem {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: 'Math' | 'Physics' | 'Chemistry' | 'Universal';
}

export type CalcKeyType = 
  | 'digit' 
  | 'operator' 
  | 'function' 
  | 'control' 
  | 'action' 
  | 'constant' 
  | 'memory';