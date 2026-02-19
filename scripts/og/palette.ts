// Site color palette — matches globals.css custom properties

export const colors = {
  bgPrimary: '#faf8f5',
  bgSecondary: '#f5f3f0',
  bgHover: '#ebe8e4',

  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#7a7a7a',

  accent: '#2563eb',
  border: '#d4d4d4',
  borderLight: '#e5e5e5',
};

export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
