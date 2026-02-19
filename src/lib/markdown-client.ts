import { createMarkdownProcessor } from './markdown-plugins';

// Singleton processor — avoids rebuilding the plugin chain per render
let processor: ReturnType<typeof createMarkdownProcessor> | null = null;

function getProcessor() {
  if (!processor) {
    processor = createMarkdownProcessor();
  }
  return processor;
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await getProcessor().process(markdown);
  return result.toString();
}

// --- Frontmatter utilities (no gray-matter — it imports Node's fs) ---

export interface Frontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  translationKey: string;
  series: string;
  seriesOrder: number | null;
}

export function defaultFrontmatter(): Frontmatter {
  return {
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    translationKey: '',
    series: '',
    seriesOrder: null,
  };
}

export function serializeFrontmatter(fm: Frontmatter): string {
  const lines: string[] = ['---'];
  lines.push(`title: "${fm.title}"`);
  lines.push(`date: "${fm.date}"`);
  lines.push(`description: "${fm.description}"`);
  if (fm.tags.length > 0) {
    lines.push('tags:');
    for (const tag of fm.tags) {
      lines.push(`  - "${tag}"`);
    }
  }
  if (fm.translationKey) {
    lines.push(`translationKey: "${fm.translationKey}"`);
  }
  if (fm.series) {
    lines.push(`series: "${fm.series}"`);
  }
  if (fm.seriesOrder !== null) {
    lines.push(`seriesOrder: ${fm.seriesOrder}`);
  }
  lines.push('---');
  return lines.join('\n');
}

/** Simple frontmatter parser for our known fields. Handles the subset of YAML we produce. */
export function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  const fm = defaultFrontmatter();

  if (!raw.startsWith('---')) {
    return { frontmatter: fm, content: raw };
  }

  const end = raw.indexOf('---', 3);
  if (end === -1) {
    return { frontmatter: fm, content: raw };
  }

  const yamlBlock = raw.slice(3, end).trim();
  const content = raw.slice(end + 3).replace(/^\n/, '');

  const tags: string[] = [];
  let inTags = false;

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();

    if (inTags) {
      if (trimmed.startsWith('- ')) {
        tags.push(trimmed.slice(2).replace(/^["']|["']$/g, ''));
        continue;
      }
      inTags = false;
    }

    if (trimmed === 'tags:') {
      inTags = true;
      continue;
    }

    const match = trimmed.match(/^(\w+):\s*(.+)$/);
    if (!match) continue;

    const [, key, val] = match;
    const unquoted = val.replace(/^["']|["']$/g, '');

    switch (key) {
      case 'title':
        fm.title = unquoted;
        break;
      case 'date':
        fm.date = unquoted;
        break;
      case 'description':
        fm.description = unquoted;
        break;
      case 'translationKey':
        fm.translationKey = unquoted;
        break;
      case 'series':
        fm.series = unquoted;
        break;
      case 'seriesOrder':
        fm.seriesOrder = parseInt(unquoted, 10) || null;
        break;
    }
  }

  fm.tags = tags;
  return { frontmatter: fm, content };
}
