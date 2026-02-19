import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, PhrasingContent } from 'mdast';
import type { BlogPostMeta } from './blog';
import type { Locale } from './i18n';

export interface ResolvedReference {
  label: string;
  url: string;
  title: string;
  description: string;
  series?: string;
  seriesOrder?: number;
  external?: boolean;
}

export interface RemarkReferencesOptions {
  locale: Locale;
  currentSeries?: string;
  allPosts: BlogPostMeta[];
}

interface ReferenceMatch {
  start: number;
  end: number;
  post: BlogPostMeta | null;
  external?: { url: string; title: string };
  raw: string;
}

// Patterns: [s1], [s:Series Name3], [ref:some-slug], [ext:URL "Title"]
const SERIES_CURRENT = /\[s(\d+)\]/g;
const SERIES_NAMED = /\[s:(.+?)(\d+)\]/g;
const REF_SLUG = /\[ref:([a-z0-9-]+)\]/g;
const EXT_URL = /\[ext:(\S+)\s+"([^"]+)"\]/g;

function findAllMatches(
  text: string,
  allPosts: BlogPostMeta[],
  currentSeries: string | undefined,
  locale: Locale,
): ReferenceMatch[] {
  const matches: ReferenceMatch[] = [];

  function collect(regex: RegExp, resolver: (m: RegExpExecArray) => BlogPostMeta | null) {
    let m: RegExpExecArray | null;
    // Reset lastIndex for safety
    regex.lastIndex = 0;
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        post: resolver(m),
        raw: m[0],
      });
    }
  }

  // [s1] - current series
  collect(SERIES_CURRENT, (m) => {
    const order = parseInt(m[1], 10);
    return currentSeries
      ? allPosts.find((p) => p.series === currentSeries && p.seriesOrder === order) ?? null
      : null;
  });

  // [s:Series Name3] - named series
  collect(SERIES_NAMED, (m) => {
    const seriesName = m[1];
    const order = parseInt(m[2], 10);
    return allPosts.find((p) => p.series === seriesName && p.seriesOrder === order) ?? null;
  });

  // [ref:slug] - by slug
  collect(REF_SLUG, (m) => {
    return allPosts.find((p) => p.slug === m[1]) ?? null;
  });

  // [ext:URL "Title"] - external links
  {
    let m: RegExpExecArray | null;
    EXT_URL.lastIndex = 0;
    while ((m = EXT_URL.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        post: null,
        external: { url: m[1], title: m[2] },
        raw: m[0],
      });
    }
  }

  // Sort by position, deduplicate overlapping matches (first match wins)
  matches.sort((a, b) => a.start - b.start);
  const deduped: ReferenceMatch[] = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      deduped.push(match);
      lastEnd = match.end;
    }
  }
  return deduped;
}

const remarkReferences: Plugin<[RemarkReferencesOptions], Root> = (options) => {
  const { locale, currentSeries, allPosts } = options;
  const references: ResolvedReference[] = [];
  let refCounter = 0;

  return (tree, vfile) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (index === undefined || !parent) return;

      const matches = findAllMatches(node.value, allPosts, currentSeries, locale);
      if (matches.length === 0) return;

      const children: PhrasingContent[] = [];
      let cursor = 0;

      for (const match of matches) {
        // Text before this match
        if (match.start > cursor) {
          children.push({ type: 'text', value: node.value.slice(cursor, match.start) });
        }

        if (match.external) {
          refCounter++;
          const label = `[${refCounter}]`;

          references.push({
            label,
            url: match.external.url,
            title: match.external.title,
            description: '',
            external: true,
          });

          children.push({
            type: 'link',
            url: match.external.url,
            data: {
              hProperties: {
                className: 'post-reference',
                'data-ref-title': match.external.title,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            },
            children: [{ type: 'text', value: label }],
          });
        } else if (match.post) {
          refCounter++;
          const label = `[${refCounter}]`;
          const url = `/${locale}/blog/${match.post.slug}/`;

          references.push({
            label,
            url,
            title: match.post.title,
            description: match.post.description,
            series: match.post.series,
            seriesOrder: match.post.seriesOrder,
          });

          children.push({
            type: 'link',
            url,
            data: {
              hProperties: {
                className: 'post-reference',
                'data-ref-title': match.post.title,
                'data-ref-description': match.post.description,
                ...(match.post.series && { 'data-ref-series': match.post.series }),
                ...(match.post.seriesOrder && { 'data-ref-order': String(match.post.seriesOrder) }),
              },
            },
            children: [{ type: 'text', value: label }],
          });
        } else {
          // Broken reference - render as dimmed span
          children.push({
            type: 'html',
            value: `<span class="broken-reference">${match.raw}</span>`,
          } as unknown as PhrasingContent);
        }

        cursor = match.end;
      }

      // Remaining text after last match
      if (cursor < node.value.length) {
        children.push({ type: 'text', value: node.value.slice(cursor) });
      }

      // Replace the text node with our new children
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });

    vfile.data.references = references;
  };
};

export default remarkReferences;
