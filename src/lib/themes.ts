export type ThemeName = 'MAPPA' | 'Warm' | 'Breeze';

export type Theme = {
  name: ThemeName;
  bg: string;
  text: string;
  accent: string;
  glow: string;
};

export const themes: Theme[] = [
  {
    name: 'MAPPA',
    bg:     '#050505',
    text:   '#ffffff',
    accent: '#d91111',
    glow:   '#0ee0c3',
  },
  {
    name: 'Warm',
    bg:     '#0a0703',
    text:   '#f5e6c8',
    accent: '#e8721c',
    glow:   '#f0c040',
  },
  {
    name: 'Breeze',
    bg:     '#f8f9f7',
    text:   '#1a1a2e',
    accent: '#4a90d9',
    glow:   '#7ec8c8',
  },
];
