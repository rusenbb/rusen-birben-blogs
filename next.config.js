/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Add trailingSlash for better CDN compatibility
  trailingSlash: true,
  // Asset prefix for cache busting (uncomment if needed)
  // assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
};

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [require('remark-math')],
    rehypePlugins: [
      require('rehype-katex'),
      require('rehype-slug'),
      require('rehype-highlight'),
    ],
  },
});

module.exports = withMDX(nextConfig);
