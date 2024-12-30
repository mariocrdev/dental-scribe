export interface ToothSection {
  name: 'oclusal' | 'mesial' | 'distal' | 'palatino' | 'vestibular';
  color: string;
}

export interface ToothData {
  sections: Record<string, string>;
  condition: string;
}

export const DEFAULT_SECTIONS: ToothSection[] = [
  { name: 'oclusal', color: '#FFFFFF' },
  { name: 'mesial', color: '#FFFFFF' },
  { name: 'distal', color: '#FFFFFF' },
  { name: 'palatino', color: '#FFFFFF' },
  { name: 'vestibular', color: '#FFFFFF' },
];

export const COLORS = [
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#F1F0FB', // Soft Gray
  '#FFFFFF', // White
];

export const TOTAL_TEETH = 32;