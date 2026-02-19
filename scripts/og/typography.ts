import { registerFont, type CanvasRenderingContext2D } from 'canvas';
import { resolve } from 'path';
import { colors, rgba } from './palette';

const FONTS_DIR = resolve(process.cwd(), 'node_modules/@fontsource');

export function registerFonts() {
  registerFont(resolve(FONTS_DIR, 'playfair-display/files/playfair-display-latin-700-normal.woff'), {
    family: 'Playfair Display',
    weight: 'bold',
  });

  registerFont(resolve(FONTS_DIR, 'inter/files/inter-latin-400-normal.woff'), {
    family: 'Inter',
    weight: 'normal',
  });

  registerFont(resolve(FONTS_DIR, 'inter/files/inter-latin-700-normal.woff'), {
    family: 'Inter',
    weight: 'bold',
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function titleFontSize(title: string): number {
  if (title.length <= 25) return 56;
  if (title.length <= 40) return 48;
  if (title.length <= 60) return 42;
  return 36;
}

export function renderTextOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  accentColor?: string,
) {
  const padding = 60;
  const fontSize = titleFontSize(title);
  const lineHeight = fontSize * 1.25;
  const metaFontSize = 20;

  // Measure title to determine backdrop height
  ctx.font = `bold ${fontSize}px "Playfair Display"`;
  const titleLines = wrapText(ctx, title, width - padding * 2);
  const titleBlockHeight = titleLines.length * lineHeight;

  // Backdrop zone: accent line (2px) + title + gap + meta + padding
  const accentLineHeight = 2;
  const gapAfterTitle = 16;
  const metaLineHeight = metaFontSize * 1.4;
  const backdropHeight =
    padding + accentLineHeight + 16 + titleBlockHeight + gapAfterTitle + metaLineHeight + padding;
  const backdropY = height - backdropHeight;

  // Long gradient fade from pattern into text zone
  const fadeStart = backdropY - 150; // start fading well above the text
  const gradient = ctx.createLinearGradient(0, fadeStart, 0, backdropY + 40);
  gradient.addColorStop(0, rgba(colors.bgPrimary, 0));
  gradient.addColorStop(0.5, rgba(colors.bgPrimary, 0.5));
  gradient.addColorStop(1, rgba(colors.bgPrimary, 0.95));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, fadeStart, width, backdropY + 40 - fadeStart);

  // Solid backdrop below the fade
  ctx.fillStyle = rgba(colors.bgPrimary, 0.95);
  ctx.fillRect(0, backdropY + 40, width, backdropHeight - 40);

  // Accent line — matches the pattern color
  const accentY = backdropY + padding;
  ctx.fillStyle = accentColor || colors.accent;
  ctx.fillRect(padding, accentY, 60, accentLineHeight);

  // Title
  ctx.font = `bold ${fontSize}px "Playfair Display"`;
  ctx.fillStyle = colors.textPrimary;
  let textY = accentY + accentLineHeight + 16 + fontSize * 0.85;

  for (const line of titleLines) {
    ctx.fillText(line, padding, textY);
    textY += lineHeight;
  }

  // Meta: author + site
  ctx.font = `${metaFontSize}px "Inter"`;
  ctx.fillStyle = colors.textMuted;
  const metaY = textY + gapAfterTitle - lineHeight + fontSize * 0.15 + metaLineHeight;
  ctx.fillText('Ruşen Birben  \u00B7  rusenbirben.com', padding, metaY);
}
