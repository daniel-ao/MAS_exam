import React from 'react';
import { MathView } from './MathView';

/**
 * RichText — a lightweight, dependency-free Markdown + KaTeX renderer tailored to the
 * course content. Supports:
 *   Blocks : # headings, paragraphs, - / * / 1. lists (nested), > blockquotes,
 *            | tables |, --- rules, $$ display math $$ (single or multi-line)
 *   Inline : $inline math$, **bold**, *italic*, `code`, [links](url), HTML entities
 */

type Size = 'base' | 'sm' | 'xs';

interface RichTextProps {
  text?: string;
  /** Render only inline formatting (no paragraphs / block wrappers). */
  inline?: boolean;
  size?: Size;
  className?: string;
}

// ---------------------------------------------------------------------------
// Inline rendering
// ---------------------------------------------------------------------------

const ENTITY_MAP: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': '\u00A0'
};

const decodeEntities = (s: string) =>
  s.replace(/&(lt|gt|amp|quot|#39|nbsp);/g, (m) => ENTITY_MAP[m] ?? m);

// Order matters: math first so that `*` or `_` inside formulas are never treated as emphasis.
const INLINE_RE = new RegExp(
  [
    String.raw`\$\$[\s\S]+?\$\$`, // inline display math  $$...$$
    String.raw`\$(?!\s)[^$\n]+?(?<!\s)\$`, // inline math         $...$
    '`[^`\\n]+`', // code
    String.raw`\*\*(?!\s)[\s\S]+?(?<!\s)\*\*`, // bold
    String.raw`(?<![\w*])\*(?![\s*])[^*\n]+?(?<![\s*])\*(?![\w*])`, // italic
    String.raw`\[[^\]\n]+\]\([^)\s]+\)` // link
  ].join('|'),
  'g'
);

export const renderInline = (text: string, keyPrefix = 'i'): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let idx = 0;
  INLINE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;

  const pushText = (t: string) => {
    if (t) nodes.push(decodeEntities(t));
  };

  // Use a fresh regex instance per call so recursion does not clobber lastIndex.
  const re = new RegExp(INLINE_RE.source, 'g');
  while ((m = re.exec(text)) !== null) {
    pushText(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${idx++}`;

    if (tok.startsWith('$$')) {
      nodes.push(<MathView key={key} math={tok.slice(2, -2).trim()} block />);
    } else if (tok.startsWith('$')) {
      nodes.push(<MathView key={key} math={tok.slice(1, -1)} />);
    } else if (tok.startsWith('`')) {
      nodes.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[0.85em] font-mono text-teal-900"
        >
          {decodeEntities(tok.slice(1, -1))}
        </code>
      );
    } else if (tok.startsWith('**')) {
      nodes.push(
        <strong key={key} className="font-semibold text-slate-900">
          {renderInline(tok.slice(2, -2), key)}
        </strong>
      );
    } else if (tok.startsWith('*')) {
      nodes.push(
        <em key={key} className="italic">
          {renderInline(tok.slice(1, -1), key)}
        </em>
      );
    } else if (tok.startsWith('[')) {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (lm) {
        nodes.push(
          <a
            key={key}
            href={lm[2]}
            target="_blank"
            rel="noreferrer"
            className="text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-900"
          >
            {renderInline(lm[1], key)}
          </a>
        );
      } else {
        pushText(tok);
      }
    }
    last = m.index + tok.length;
  }
  pushText(text.slice(last));
  return nodes;
};

// ---------------------------------------------------------------------------
// Block parsing
// ---------------------------------------------------------------------------

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'math'; tex: string }
  | { type: 'hr' }
  | { type: 'quote'; blocks: Block[] }
  | { type: 'table'; header: string[]; align: ('left' | 'center' | 'right')[]; rows: string[][] }
  | { type: 'list'; ordered: boolean; start: number; items: Block[][] };

const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HEADING_RE = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const HR_RE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const TABLE_SEP_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

const indentOf = (line: string) => {
  const m = /^(\s*)/.exec(line);
  return m ? m[1].replace(/\t/g, '    ').length : 0;
};

const splitRow = (line: string): string[] => {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  // split on | that is not inside $...$
  const cells: string[] = [];
  let cur = '';
  let inMath = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '$') inMath = !inMath;
    if (ch === '|' && !inMath && s[i - 1] !== '\\') {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
};

const isTableStart = (lines: string[], i: number) =>
  lines[i].trim().startsWith('|') && i + 1 < lines.length && TABLE_SEP_RE.test(lines[i + 1]) && lines[i + 1].includes('-');

const isBlockStart = (lines: string[], i: number) => {
  const line = lines[i];
  const t = line.trim();
  return (
    t.startsWith('$$') ||
    HEADING_RE.test(line) ||
    HR_RE.test(line) ||
    t.startsWith('>') ||
    LIST_RE.test(line) ||
    isTableStart(lines, i)
  );
};

const parseBlocks = (lines: string[]): Block[] => {
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    if (!t) {
      i++;
      continue;
    }

    // Display math $$ ... $$
    if (t.startsWith('$$')) {
      const rest = t.slice(2);
      const closeIdx = rest.indexOf('$$');
      if (closeIdx >= 0) {
        blocks.push({ type: 'math', tex: rest.slice(0, closeIdx).trim() });
        const tail = rest.slice(closeIdx + 2).trim();
        if (tail) blocks.push({ type: 'paragraph', lines: [tail] });
        i++;
        continue;
      }
      const buf: string[] = [rest];
      i++;
      let tail = '';
      while (i < lines.length) {
        const l = lines[i];
        const c = l.indexOf('$$');
        if (c >= 0) {
          buf.push(l.slice(0, c));
          tail = l.slice(c + 2).trim();
          i++;
          break;
        }
        buf.push(l);
        i++;
      }
      blocks.push({ type: 'math', tex: buf.join('\n').trim() });
      if (tail) blocks.push({ type: 'paragraph', lines: [tail] });
      continue;
    }

    // Heading
    const hm = HEADING_RE.exec(line);
    if (hm) {
      blocks.push({ type: 'heading', level: hm[1].length, text: hm[2] });
      i++;
      continue;
    }

    // Horizontal rule
    if (HR_RE.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Table
    if (isTableStart(lines, i)) {
      const header = splitRow(lines[i]);
      const align = splitRow(lines[i + 1]).map((c) => {
        const l = c.startsWith(':');
        const r = c.endsWith(':');
        return l && r ? 'center' : r ? 'right' : 'left';
      }) as ('left' | 'center' | 'right')[];
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', header, align, rows });
      continue;
    }

    // Blockquote
    if (t.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', blocks: parseBlocks(buf) });
      continue;
    }

    // List
    const lm = LIST_RE.exec(line);
    if (lm) {
      const baseIndent = indentOf(line);
      const ordered = /\d/.test(lm[2]);
      const start = ordered ? parseInt(lm[2], 10) : 1;
      const items: Block[][] = [];

      while (i < lines.length) {
        const cur = lines[i];
        const cm = LIST_RE.exec(cur);
        if (!cm || indentOf(cur) !== baseIndent || /\d/.test(cm[2]) !== ordered) break;

        const contentIndent = baseIndent + cm[2].length + 1;
        const itemLines: string[] = [cm[3]];
        i++;

        while (i < lines.length) {
          const nl = lines[i];
          if (!nl.trim()) {
            // blank line: continue item only if the next non-blank line is indented under it
            let j = i + 1;
            while (j < lines.length && !lines[j].trim()) j++;
            if (j < lines.length && indentOf(lines[j]) > baseIndent) {
              itemLines.push('');
              i++;
              continue;
            }
            break;
          }
          const ind = indentOf(nl);
          if (ind > baseIndent) {
            // nested content (sub-list, math, continuation)
            itemLines.push(nl.slice(Math.min(ind, contentIndent)));
            i++;
            continue;
          }
          // lazy continuation of plain text at same indent
          if (ind === baseIndent && !isBlockStart(lines, i)) {
            itemLines.push(nl.trim());
            i++;
            continue;
          }
          break;
        }
        items.push(parseBlocks(itemLines));
      }

      blocks.push({ type: 'list', ordered, start, items });
      continue;
    }

    // Paragraph
    const buf: string[] = [t];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines, i)) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: 'paragraph', lines: buf });
  }

  return blocks;
};

// ---------------------------------------------------------------------------
// Block rendering
// ---------------------------------------------------------------------------

const SIZE_CLASSES: Record<Size, { body: string; h2: string; h3: string; h4: string; gap: string }> = {
  base: {
    body: 'text-[15px] leading-7',
    h2: 'text-xl',
    h3: 'text-lg',
    h4: 'text-base',
    gap: 'space-y-4'
  },
  sm: {
    body: 'text-sm leading-6',
    h2: 'text-lg',
    h3: 'text-base',
    h4: 'text-sm',
    gap: 'space-y-3'
  },
  xs: {
    body: 'text-xs leading-5',
    h2: 'text-sm',
    h3: 'text-sm',
    h4: 'text-xs',
    gap: 'space-y-2'
  }
};

const renderParagraphLines = (lines: string[], key: string) =>
  lines.map((l, li) => (
    <React.Fragment key={`${key}-l${li}`}>
      {li > 0 && <br />}
      {renderInline(l, `${key}-l${li}`)}
    </React.Fragment>
  ));

const renderBlocks = (blocks: Block[], size: Size, keyPrefix: string, tight = false): React.ReactNode[] => {
  const sc = SIZE_CLASSES[size];

  return blocks.map((b, bi) => {
    const key = `${keyPrefix}-${bi}`;
    switch (b.type) {
      case 'heading': {
        if (b.level <= 2) {
          return (
            <h3 key={key} className={`${sc.h2} font-bold text-slate-900 tracking-tight pt-2`}>
              {renderInline(b.text, key)}
            </h3>
          );
        }
        if (b.level === 3) {
          return (
            <h4
              key={key}
              className={`${sc.h3} font-bold text-teal-900 pt-3 pb-1 border-b border-teal-100 flex items-center gap-2`}
            >
              <span className="w-1.5 h-5 rounded-full bg-teal-600 shrink-0" aria-hidden />
              <span>{renderInline(b.text, key)}</span>
            </h4>
          );
        }
        return (
          <h5 key={key} className={`${sc.h4} font-semibold text-slate-800 pt-2`}>
            {renderInline(b.text, key)}
          </h5>
        );
      }

      case 'paragraph':
        return (
          <p key={key} className="text-slate-700">
            {renderParagraphLines(b.lines, key)}
          </p>
        );

      case 'math':
        return (
          <div
            key={key}
            className="my-1 px-4 py-1 rounded-xl bg-stone-50 border border-stone-200 overflow-x-auto text-slate-900"
          >
            <MathView math={b.tex} block />
          </div>
        );

      case 'hr':
        return <hr key={key} className="my-2 border-stone-200" />;

      case 'quote':
        return (
          <blockquote
            key={key}
            className="border-l-4 border-amber-400 bg-amber-50/60 rounded-r-xl px-4 py-3 text-slate-800 space-y-2"
          >
            {renderBlocks(b.blocks, size, key, true)}
          </blockquote>
        );

      case 'table':
        return (
          <div key={key} className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
            <table className="w-full text-left border-collapse text-[0.92em]">
              <thead className="bg-stone-100 text-slate-800">
                <tr>
                  {b.header.map((h, hi) => (
                    <th
                      key={hi}
                      className="px-3 py-2 font-semibold border-b border-stone-200 whitespace-nowrap"
                      style={{ textAlign: b.align[hi] || 'left' }}
                    >
                      {renderInline(h, `${key}-h${hi}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'}>
                    {b.header.map((_, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-2 border-t border-stone-100 align-top text-slate-700"
                        style={{ textAlign: b.align[ci] || 'left' }}
                      >
                        {renderInline(r[ci] ?? '', `${key}-r${ri}c${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'list': {
        const ListTag = b.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={key}
            start={b.ordered ? b.start : undefined}
            className={`${b.ordered ? 'list-decimal marker:font-semibold marker:text-teal-700' : 'list-disc marker:text-teal-600'} pl-6 space-y-1.5 text-slate-700`}
          >
            {b.items.map((item, ii) => (
              <li key={ii} className="pl-1">
                <div className="space-y-2">
                  {item.length === 1 && item[0].type === 'paragraph'
                    ? renderParagraphLines(item[0].lines, `${key}-it${ii}`)
                    : renderBlocks(item, size, `${key}-it${ii}`, true)}
                </div>
              </li>
            ))}
          </ListTag>
        );
      }
    }
  });
};

export const RichText: React.FC<RichTextProps> = ({ text, inline = false, size = 'base', className = '' }) => {
  if (!text) return null;

  if (inline) {
    return <span className={className}>{renderInline(text)}</span>;
  }

  const blocks = parseBlocks(text.replace(/\r\n?/g, '\n').split('\n'));
  const sc = SIZE_CLASSES[size];

  return <div className={`${sc.body} ${sc.gap} ${className}`}>{renderBlocks(blocks, size, 'b')}</div>;
};

/** Strip markdown / LaTeX delimiters to produce a plain-text snippet (for search results, tooltips). */
export const toPlainText = (text: string) =>
  decodeEntities(
    text
      .replace(/\$\$([\s\S]+?)\$\$/g, ' $1 ')
      .replace(/\$([^$\n]+?)\$/g, '$1')
      .replace(/^\s{0,3}#{1,6}\s+/gm, '')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*\|?[\s:|-]{3,}\|?\s*$/gm, ' ')
      .replace(/\|/g, ' ')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/(?<![\w*])\*([^*\n]+)\*(?![\w*])/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\\(text|mathbf|mathrm|operatorname)\{([^}]*)\}/g, '$2')
      .replace(/\s+/g, ' ')
      .trim()
  );

export default RichText;

