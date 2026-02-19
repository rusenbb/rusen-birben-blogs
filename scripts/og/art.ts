import { createCanvas, loadImage } from 'canvas';
import type { CanvasRenderingContext2D } from 'canvas';
import geopattern, { type GeneratorType } from 'geopattern';
import { colors, rgba } from './palette';
import { rngRange } from './seed';

// Pattern types that look best at OG image scale
const goodPatterns: GeneratorType[] = [
  'chevrons',
  'overlappingCircles',
  'hexagons',
  'overlappingRings',
  'diamonds',
  'mosaicSquares',
  'concentricCircles',
  'tessellation',
  'triangles',
  'nestedSquares',
];

export async function renderPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  translationKey: string,
): Promise<string> {
  // Solid warm background first
  ctx.fillStyle = colors.bgPrimary;
  ctx.fillRect(0, 0, width, height);

  // Pick a pattern type deterministically from the key
  const patternIndex = Math.floor(rng() * goodPatterns.length);
  const generator = goodPatterns[patternIndex];

  // Generate the tiling SVG with a muted base color
  const pattern = geopattern.generate(translationKey, {
    generator,
    baseColor: '#9ca3af', // neutral gray — pattern shapes will vary around this
  });

  const svg = pattern.toSvg();

  // Load SVG as image and tile it across the canvas
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  const img = await loadImage(dataUri);

  // Tile the pattern
  const canvasPattern = ctx.createPattern(img, 'repeat');
  if (canvasPattern) {
    ctx.fillStyle = canvasPattern;
    ctx.fillRect(0, 0, width, height);
  }

  // Overlay with semi-transparent site background to soften and warm the pattern
  ctx.fillStyle = rgba(colors.bgPrimary, 0.3);
  ctx.fillRect(0, 0, width, height);

  return pattern.color;
}

export function renderGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensity = 12;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (rng() - 0.5) * intensity;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}
