import { ConstantItem } from '../types/calculator';

export const SCIENTIFIC_CONSTANTS: ConstantItem[] = [
  { symbol: 'π', name: 'Pi', value: Math.PI, unit: 'dimensionless', category: 'Math' },
  { symbol: 'e', name: "Euler's Number", value: Math.E, unit: 'dimensionless', category: 'Math' },
  { symbol: 'φ', name: 'Golden Ratio', value: 1.618033988749895, unit: 'dimensionless', category: 'Math' },
  { symbol: 'c', name: 'Speed of Light in Vacuum', value: 299792458, unit: 'm/s', category: 'Physics' },
  { symbol: 'h', name: "Planck's Constant", value: 6.62607015e-34, unit: 'J·s', category: 'Physics' },
  { symbol: 'ħ', name: 'Reduced Planck Constant (h-bar)', value: 1.054571817e-34, unit: 'J·s', category: 'Physics' },
  { symbol: 'G', name: 'Newtonian Gravitational Constant', value: 6.6743e-11, unit: 'm³/(kg·s²)', category: 'Physics' },
  { symbol: 'g', name: 'Standard Acceleration of Gravity', value: 9.80665, unit: 'm/s²', category: 'Physics' },
  { symbol: 'k_B', name: 'Boltzmann Constant', value: 1.380649e-23, unit: 'J/K', category: 'Physics' },
  { symbol: 'N_A', name: 'Avogadro Constant', value: 6.02214076e23, unit: 'mol⁻¹', category: 'Chemistry' },
  { symbol: 'R', name: 'Molar Gas Constant', value: 8.314462618, unit: 'J/(mol·K)', category: 'Chemistry' },
  { symbol: 'F', name: 'Faraday Constant', value: 96485.33212, unit: 'C/mol', category: 'Chemistry' },
  { symbol: 'q_e', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C', category: 'Universal' },
  { symbol: 'm_e', name: 'Electron Rest Mass', value: 9.1093837015e-31, unit: 'kg', category: 'Universal' },
  { symbol: 'm_p', name: 'Proton Rest Mass', value: 1.67262192369e-27, unit: 'kg', category: 'Universal' },
  { symbol: 'ε_0', name: 'Vacuum Electric Permittivity', value: 8.8541878128e-12, unit: 'F/m', category: 'Physics' },
  { symbol: 'μ_0', name: 'Vacuum Magnetic Permeability', value: 1.25663706212e-6, unit: 'N/A²', category: 'Physics' },
  { symbol: 'σ', name: 'Stefan-Boltzmann Constant', value: 5.670374419e-8, unit: 'W/(m²·K⁴)', category: 'Physics' }
];