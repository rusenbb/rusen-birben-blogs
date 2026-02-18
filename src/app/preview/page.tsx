import type { Metadata } from 'next';
import { PreviewEditor } from './PreviewEditor';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <PreviewEditor />;
}
