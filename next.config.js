/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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
