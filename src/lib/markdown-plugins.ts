import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginTuple = [any, ...any[]];

/**
 * Creates a unified processor with the shared remark/rehype plugin chain.
 * Used by both server-side (blog.ts) and client-side (markdown-client.ts)
 * to ensure consistent rendering.
 *
 * @param extraRemarkPlugins - Additional remark plugins inserted before remarkRehype
 */
export function createMarkdownProcessor(extraRemarkPlugins?: PluginTuple[]) {
  let processor = unified()
    .use(remarkParse)
    .use(remarkMath);

  if (extraRemarkPlugins) {
    for (const [plugin, ...opts] of extraRemarkPlugins) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processor = processor.use(plugin, ...opts) as any;
    }
  }

  return processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true });
}
