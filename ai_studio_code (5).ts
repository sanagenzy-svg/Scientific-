import { AngleMode, FloatMode } from '../types/calculator';

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Invalid nPr parameters');
  return factorial(n) / factorial(n - r);
}

export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Invalid nCr parameters');
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function formatResult(val: number, mode: FloatMode = 'NORM'): string {
  if (!Number.isFinite(val)) {
    if (Number.isNaN(val)) return 'Error: Undefined';
    return val > 0 ? 'Infinity' : '-Infinity';
  }
  if (Math.abs(val) < 1e-15 && Math.abs(val) > 0) return '0';
  const rounded = Math.round(val);
  if (Math.abs(val - rounded) < 1e-12) val = rounded;
  if (mode === 'FIX2') return val.toFixed(2);
  if (mode === 'SCI') return val.toExponential(6);
  if (Math.abs(val) >= 1e12 || (Math.abs(val) < 1e-6 && val !== 0)) {
    return val.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return parseFloat(val.toPrecision(12)).toString();
}

export function evaluateExpression(expr: string, angleMode: AngleMode, prevAns: number = 0): number {
  if (!expr || expr.trim() === '') return 0;
  let s = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\bpi\b/gi, `(${Math.PI})`)
    .replace(/\bAns\b/gi, `(${prevAns})`)
    .replace(/\be\b/g, `(${Math.E})`)
    .replace(/φ/g, `(1.618033988749895)`);

  s = s.replace(/√\(/g, 'sqrt(');
  s = s.replace(/√([0-9.]+)/g, 'sqrt($1)');
  s = s.replace(/∛\(/g, 'cbrt(');
  s = s.replace(/∛([0-9.]+)/g, 'cbrt($1)');
  s = s.replace(/([0-9.]+)E([+-]?[0-9]+)/g, '($1*(10^$2))');
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(\))(\d)/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');
  s = s.replace(/(\d)(sqrt|cbrt|sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|ln|log|abs)/gi, '$1*$2');

  let openCount = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') openCount++;
    if (s[i] === ')') openCount--;
  }
  while (openCount > 0) {
    s += ')';
    openCount--;
  }

  const tokens = tokenize(s);
  return parseExpression(tokens, angleMode);
}

type Token = 
  | { type: 'num'; value: number }
  | { type: 'op'; value: string }
  | { type: 'fn'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' }
  | { type: 'postfix'; value: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];
    if (/\s/.test(char)) { i++; continue; }
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < input.length && /[0-9.]/.test(input[i])) { numStr += input[i]; i++; }
      tokens.push({ type: 'num', value: parseFloat(numStr) });
      continue;
    }
    if (/[a-zA-Z_]/.test(char)) {
      let id = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) { id += input[i]; i++; }
      const lower = id.toLowerCase();
      if (lower === 'ncr' || lower === 'npr' || lower === 'mod') {
        tokens.push({ type: 'op', value: lower });
      } else {
        tokens.push({ type: 'fn', value: lower });
      }
      continue;
    }
    if (char === '!') { tokens.push({ type: 'postfix', value: '!' }); i++; continue; }
    if (char === '%') { tokens.push({ type: 'postfix', value: '%' }); i++; continue; }
    if (char === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
    if (char === ')') { tokens.push({ type: 'rparen' }); i++; continue; }
    if (char === ',') { tokens.push({ type: 'comma' }); i++; continue; }
    if (['+', '-', '*', '/', '^'].includes(char)) {
      const prev = tokens[tokens.length - 1];
      const isUnary = !prev || prev.type === 'op' || prev.type === 'lparen' || prev.type === 'comma';
      if (isUnary && (char === '+' || char === '-')) {
        tokens.push({ type: 'op', value: char === '-' ? 'neg' : 'pos' });
      } else {
        tokens.push({ type: 'op', value: char });
      }
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

function parseExpression(tokens: Token[], angleMode: AngleMode): number {
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function getPrecedence(op: string): number {
    switch (op) {
      case '+': case '-': return 1;
      case '*': case '/': case 'mod': case 'ncr': case 'npr': return 2;
      case '^': return 4;
      default: return 0;
    }
  }

  function parsePrimary(): number {
    const token = consume();
    if (!token) throw new Error('Unexpected end of input');
    if (token.type === 'num') return token.value;
    if (token.type === 'op' && token.value === 'neg') return -parsePrimary();
    if (token.type === 'op' && token.value === 'pos') return parsePrimary();
    if (token.type === 'lparen') {
      const val = parseBinary(0);
      const next = consume();
      return val;
    }
    if (token.type === 'fn') {
      let hasParen = false;
      if (peek() && peek()?.type === 'lparen') {
        consume();
        hasParen = true;
      }
      const arg = parseBinary(0);
      if (hasParen && peek() && peek()?.type === 'rparen') {
        consume();
      }
      return applyFunction(token.value, arg, angleMode);
    }
    throw new Error('Syntax error');
  }

  function parsePostfix(expr: number): number {
    while (peek() && peek()?.type === 'postfix') {
      const token = consume() as { type: 'postfix'; value: string };
      if (token.value === '!') expr = factorial(expr);
      else if (token.value === '%') expr = expr / 100;
    }
    return expr;
  }

  function parseBinary(minPrec: number): number {
    let left = parsePrimary();
    left = parsePostfix(left);
    while (peek() && peek()?.type === 'op') {
      const opToken = peek() as { type: 'op'; value: string };
      const prec = getPrecedence(opToken.value);
      if (prec < minPrec) break;
      consume();
      const isRightAssoc = opToken.value === '^';
      const right = parseBinary(isRightAssoc ? prec : prec + 1);
      left = applyBinaryOp(opToken.value, left, right);
      left = parsePostfix(left);
    }
    return left;
  }

  return parseBinary(0);
}

function applyBinaryOp(op: string, a: number, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Divide by zero');
      return a / b;
    case '^': return Math.pow(a, b);
    case 'mod': return a % b;
    case 'ncr': return combinations(a, b);
    case 'npr': return permutations(a, b);
    default: throw new Error(`Unknown operator: ${op}`);
  }
}

function applyFunction(fn: string, arg: number, angleMode: AngleMode): number {
  const toRad = (x: number) => (angleMode === 'DEG' ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angleMode === 'DEG' ? (x * 180) / Math.PI : x);

  switch (fn) {
    case 'sin': return Math.sin(toRad(arg));
    case 'cos': return Math.cos(toRad(arg));
    case 'tan':
      if (angleMode === 'DEG' && Math.abs(arg % 180) === 90) throw new Error('Undefined: tan(90°)');
      return Math.tan(toRad(arg));
    case 'asin': case 'arcsin':
      if (arg < -1 || arg > 1) throw new Error('Domain Error for asin');
      return fromRad(Math.asin(arg));
    case 'acos': case 'arccos':
      if (arg < -1 || arg > 1) throw new Error('Domain Error for acos');
      return fromRad(Math.acos(arg));
    case 'atan': case 'arctan': return fromRad(Math.atan(arg));
    case 'sinh': return Math.sinh(arg);
    case 'cosh': return Math.cosh(arg);
    case 'tanh': return Math.tanh(arg);
    case 'asinh': return Math.asinh(arg);
    case 'acosh':
      if (arg < 1) throw new Error('Domain Error for acosh');
      return Math.acosh(arg);
    case 'atanh':
      if (arg <= -1 || arg >= 1) throw new Error('Domain Error for atanh');
      return Math.atanh(arg);
    case 'ln':
      if (arg <= 0) throw new Error('Domain Error: ln(x <= 0)');
      return Math.log(arg);
    case 'log': case 'log10':
      if (arg <= 0) throw new Error('Domain Error: log(x <= 0)');
      return Math.log10(arg);
    case 'log2':
      if (arg <= 0) throw new Error('Domain Error: log2(x <= 0)');
      return Math.log2(arg);
    case 'sqrt':
      if (arg < 0) throw new Error('Domain Error: sqrt(x < 0)');
      return Math.sqrt(arg);
    case 'cbrt': return Math.cbrt(arg);
    case 'abs': return Math.abs(arg);
    case 'exp': return Math.exp(arg);
    default: throw new Error(`Unknown function: ${fn}`);
  }
}