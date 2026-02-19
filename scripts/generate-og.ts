import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { collectPostsForOG } from './og/collect-posts';
import { hashString, createRng } from './og/seed';
import { renderPattern, renderGrain } from './og/art';
import { registerFonts, renderTextOverlay } from './og/typography';

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(process.cwd(), 'public/og');
const force = process.argv.includes('--force');

async function generateImage(translationKey: string, title: string): Promise<Buffer> {
  const seed = hashString(translationKey);
  const rng = createRng(seed);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const patternColor = await renderPattern(ctx, WIDTH, HEIGHT, rng, translationKey);
  renderGrain(ctx, WIDTH, HEIGHT, rng);
  renderTextOverlay(ctx, WIDTH, HEIGHT, title, patternColor);

  return canvas.toBuffer('image/jpeg', { quality: 0.85 });
}

async function main() {
  registerFonts();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const posts = collectPostsForOG();
  let generated = 0;
  let skipped = 0;

  for (const post of posts) {
    const outputPath = path.join(OUTPUT_DIR, `${post.translationKey}.jpg`);

    if (!force && fs.existsSync(outputPath)) {
      skipped++;
      console.log(`  skip  ${post.translationKey}.jpg (exists)`);
      continue;
    }

    const buffer = await generateImage(post.translationKey, post.title);
    fs.writeFileSync(outputPath, buffer);
    generated++;
    console.log(`  done  ${post.translationKey}.jpg  "${post.title}"`);
  }

  console.log(`\nOG images: ${generated} generated, ${skipped} skipped`);
}

main();
