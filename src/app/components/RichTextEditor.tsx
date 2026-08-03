import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Quote, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Image as ImageIcon, Undo2, Redo2, Eraser, Heading2, Heading3, Pilcrow, X
} from 'lucide-react';
import { sanitizeHtml } from '../../lib/sanitizeHtml';
import { ImageUploader } from './ImageUploader';

const BLOCK_FORMATS = [
  { value: 'p', label: 'Paragraph', icon: <Pilcrow size={14} /> },
  { value: 'h2', label: 'Heading 2', icon: <Heading2 size={14} /> },
  { value: 'h3', label: 'Heading 3', icon: <Heading3 size={14} /> },
  { value: 'blockquote', label: 'Quote', icon: <Quote size={14} /> },
];

function exec(command: string, value?: string) {
  try {
    document.execCommand(command, false, value);
  } catch (e) {
    console.warn(`execCommand("${command}") failed:`, e);
  }
}

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function RichTextEditor({ value, onChange, placeholder = 'Write your article…', minHeight = 300 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedRef = useRef<string>(value || '');
  const hydratedRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // Read current DOM content, sanitize and emit it (no DOM rewrite so the
  // caret position is never reset while typing).
  const syncFromDom = () => {
    if (!editorRef.current) return;
    const raw = editorRef.current.innerHTML;
    const clean = sanitizeHtml(raw);
    lastEmittedRef.current = clean;
    onChange(clean);
  };

  useEffect(() => {
    // Enter should always create a new <p> paragraph (Chrome/Edge/WebKit).
    exec('defaultParagraphSeparator', 'p');
  }, []);

  useEffect(() => {
    // Always hydrate the editable area from `value` on mount, and whenever the
    // value changes externally (e.g. editing a different article). Without this,
    // re-mounting after a Preview toggle shows an empty editor.
    if (!editorRef.current) return;
    if (!hydratedRef.current || value !== lastEmittedRef.current) {
      editorRef.current.innerHTML = value || '';
    }
    hydratedRef.current = true;
    lastEmittedRef.current = value || '';
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      const clean = sanitizeHtml(html);
      if (clean.trim()) {
        exec('insertHTML', clean);
        syncFromDom();
        return;
      }
    }
    exec('insertText', text);
    syncFromDom();
  };

  const run = (command: string, value?: string) => {
    saveSelection();
    restoreSelection();
    exec(command, value);
    syncFromDom();
  };

  const insertLink = () => {
    saveSelection();
    const url = window.prompt('Enter link URL (https://…):');
    if (url) {
      restoreSelection();
      exec('createLink', url);
      syncFromDom();
    }
  };

  const insertImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    restoreSelection();
    exec('insertHTML', `<img src="${url.replace(/"/g, '&quot;')}" alt="" />`);
    setImageUrl('');
    setShowImagePicker(false);
    syncFromDom();
  };

  const insertUploadedImage = (url: string) => {
    if (!url) return;
    restoreSelection();
    exec('insertHTML', `<img src="${url.replace(/"/g, '&quot;')}" alt="" />`);
    setShowImagePicker(false);
    syncFromDom();
  };

  const ToolbarButton = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { saveSelection(); e.preventDefault(); }}
      onClick={() => { restoreSelection(); onClick(); }}
      className="toolbar-btn"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-zinc-300 focus-within:ring-2 focus-within:ring-primary overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 bg-zinc-50">
        <ToolbarButton title="Undo" onClick={() => exec('undo')}><Undo2 size={15} /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => exec('redo')}><Redo2 size={15} /></ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-1" />

        <select
          title="Block format"
          defaultValue="p"
          onMouseDown={saveSelection}
          onChange={e => run('formatBlock', `<${e.target.value}>`)}
          className="h-8 px-2 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 outline-none focus:border-primary cursor-pointer"
        >
          {BLOCK_FORMATS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <ToolbarButton title="Bold" onClick={() => exec('bold')}><Bold size={15} /></ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => exec('italic')}><Italic size={15} /></ToolbarButton>
        <ToolbarButton title="Underline" onClick={() => exec('underline')}><Underline size={15} /></ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => exec('strikeThrough')}><Strikethrough size={15} /></ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-1" />

        <ToolbarButton title="Bullet list" onClick={() => exec('insertUnorderedList')}><List size={15} /></ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={15} /></ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => exec('formatBlock', '<blockquote>')}><Quote size={15} /></ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-1" />

        <ToolbarButton title="Align left" onClick={() => exec('justifyLeft')}><AlignLeft size={15} /></ToolbarButton>
        <ToolbarButton title="Align center" onClick={() => exec('justifyCenter')}><AlignCenter size={15} /></ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => exec('justifyRight')}><AlignRight size={15} /></ToolbarButton>
        <ToolbarButton title="Justify" onClick={() => exec('justifyFull')}><AlignJustify size={15} /></ToolbarButton>

        <span className="w-px h-5 bg-zinc-300 mx-1" />

        <ToolbarButton title="Insert link" onClick={insertLink}><Link2 size={15} /></ToolbarButton>

        <div className="relative">
          <button
            type="button"
            title="Insert image"
            onMouseDown={(e) => { saveSelection(); e.preventDefault(); }}
            onClick={() => setShowImagePicker(v => !v)}
            className="toolbar-btn !text-primary"
          >
            <ImageIcon size={15} />
          </button>
          {showImagePicker && (
            <div
              className="absolute left-0 top-full z-30 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-zinc-200 p-3 space-y-3"
              onMouseDown={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700">Insert Image</span>
                <button type="button" onClick={() => setShowImagePicker(false)} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-500">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Upload from device</span>
                <ImageUploader
                  className="!aspect-auto"
                  onUploadComplete={(url) => insertUploadedImage(url)}
                />
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500 pt-1">
                  <span className="h-px flex-1 bg-zinc-200" />
                  <span>or use URL</span>
                  <span className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://…image.jpg"
                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-300 text-xs outline-none focus:border-primary"
                  />
                  <button type="button" onClick={insertImageUrl} disabled={!imageUrl.trim()} className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 disabled:opacity-40">
                    Insert
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="w-px h-5 bg-zinc-300 mx-1" />

        <ToolbarButton title="Clear formatting" onClick={() => exec('removeFormat')}><Eraser size={15} /></ToolbarButton>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncFromDom}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        className="rich-editor article-body"
        style={{ minHeight }}
      />
    </div>
  );
}
