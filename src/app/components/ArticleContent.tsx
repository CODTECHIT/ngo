import { sanitizeHtml } from '../../lib/sanitizeHtml';

const BLOCK_TAG = /<(p|div|h[1-6]|ul|ol|li|blockquote|table|figure)\b/i;

// Guarantees the article body is displayed as readable paragraphs even when the
// stored content is plain text or contains only <br> line breaks (which is what
// happens when text is typed or pasted without rich-text HTML).
export function normalizeArticleHtml(html: unknown): string {
  if (typeof html !== 'string' || !html.trim()) return '';

  const clean = String(sanitizeHtml(html) ?? '').trim();
  if (!clean) return '';

  // Already structured rich text — render as-is (converting the flat <div>
  // blocks some browsers produce in a contentEditable into proper <p>
  // paragraphs so spacing and alignment render perfectly).
  if (BLOCK_TAG.test(clean)) {
    return clean
      .replace(/<div\b([^>]*)>/gi, (m, attrs) => `<p${attrs || ''}>`)
      .replace(/<\/div>/gi, '</p>');
  }

  // Convert <br> and newlines into <p> paragraphs so nothing is collapsed away.
  return clean
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/\n+/)
    .map(line => (line || '').trim())
    .filter(Boolean)
    .map(line => `<p>${line}</p>`)
    .join('');
}

type ArticleContentProps = {
  html: string;
  className?: string;
};

export function ArticleContent({ html, className = '' }: ArticleContentProps) {
  return (
    <div
      className={`article-body ${className}`}
      dangerouslySetInnerHTML={{ __html: normalizeArticleHtml(html || '') }}
    />
  );
}
