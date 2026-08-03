// Lightweight HTML sanitizer that preserves rich-text formatting pasted from
// Word, Google Docs or web pages (headings, bold/italic/underline, lists,
// quotes, alignment, links, images) while stripping anything that could
// execute scripts or break the page layout.

const ALLOWED_TAGS = new Set<string>([
  'p', 'br', 'div', 'span',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'sub', 'sup', 'small', 'code', 'pre',
  'ul', 'ol', 'li', 'blockquote', 'hr',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
]);

// Dropped entirely together with their children.
const DROP_TAGS = new Set<string>([
  'script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button',
  'textarea', 'select', 'link', 'meta', 'base', 'svg', 'math', 'video', 'audio',
  'source', 'track', 'template', 'canvas', 'noscript',
]);

const ATTRS_BY_TAG: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  p: ['align'],
  div: ['align'],
  h1: ['align'],
  h2: ['align'],
  h3: ['align'],
  h4: ['align'],
  h5: ['align'],
  h6: ['align'],
  blockquote: ['align'],
  li: ['align'],
  figure: ['align'],
  figcaption: ['align'],
  tr: ['align'],
  table: ['align'],
  th: ['align', 'colspan', 'rowspan'],
  td: ['align', 'colspan', 'rowspan'],
  span: ['style'],
  strong: ['style'],
  b: ['style'],
  em: ['style'],
  i: ['style'],
  u: ['style'],
  mark: ['style'],
};

// Inline styles we allow so pasted alignment/emphasis survives, while exotic
// values (url(), expression(), javascript:) are rejected.
const ALLOWED_CSS_PROPS = new Set<string>([
  'text-align', 'text-decoration', 'text-decoration-line', 'text-decoration-style',
  'font-weight', 'font-style',
  'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
  'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'list-style-type', 'vertical-align', 'line-height',
  'color', 'background-color',
]);

const SAFE_SCHEMES = /^(https?:|mailto:|tel:|data:image\/(png|jpe?g|gif|webp);base64,)/i;
const RELATIVE_PATH = /^(\.{0,2}\/|#|$)/;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (RELATIVE_PATH.test(trimmed)) return true;
  return SAFE_SCHEMES.test(trimmed);
}

function sanitizeStyle(raw: string): string {
  const out: string[] = [];
  for (const decl of raw.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim().toLowerCase();
    let val = decl.slice(idx + 1).trim();
    if (!ALLOWED_CSS_PROPS.has(prop)) continue;
    if (/url\s*\(|expression\s*\(|javascript:/i.test(val)) continue;
    val = val.replace(/!important/gi, '').trim();
    if (!val) continue;
    out.push(`${prop}:${val}`);
  }
  return out.join(';');
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof document === 'undefined') return html;

  try {
    const template = document.createElement('template');
    template.innerHTML = String(html);
    const root = template.content;
    if (!root) return '';

    const nodes: Element[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Element);

    nodes.forEach((el) => {
      const tag = el.tagName.toLowerCase();

      if (DROP_TAGS.has(tag)) {
        el.remove();
        return;
      }

      if (!ALLOWED_TAGS.has(tag)) {
        // Unwrap disallowed containers but keep their content.
        while (el.firstChild) el.parentNode!.insertBefore(el.firstChild, el);
        el.remove();
        return;
      }

      const allowed = ATTRS_BY_TAG[tag] || [];
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();

        if (!allowed.includes(name)) {
          el.removeAttribute(attr.name);
          return;
        }

        if (name === 'href' || name === 'src') {
          if (!isSafeUrl(attr.value)) el.removeAttribute(attr.name);
          return;
        }

        if (name === 'target' && attr.value !== '_blank') {
          el.removeAttribute(attr.name);
          return;
        }

        if (name === 'rel' && !/noopener|noreferrer/.test(attr.value)) {
          el.removeAttribute(attr.name);
          return;
        }

        if (name === 'style') {
          const clean = sanitizeStyle(attr.value);
          if (clean) el.setAttribute('style', clean);
          else el.removeAttribute('style');
        }
      });
    });

    return String(template.innerHTML ?? '');
  } catch (e) {
    console.warn('sanitizeHtml failed, returning text only:', e);
    // Escape and wrap the raw text so no scripts survive and nothing crashes.
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export function htmlToPlainText(html: string): string {
  if (!html) return '';
  if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, ' ');
  const template = document.createElement('template');
  template.innerHTML = sanitizeHtml(html);
  return (template.content.textContent || '').replace(/\s+/g, ' ').trim();
}

export function htmlToExcerpt(html: string, maxLength = 180): string {
  const text = htmlToPlainText(html);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[,;:]+$/, '') + '…';
}
