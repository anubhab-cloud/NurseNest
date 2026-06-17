import { useMemo } from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

// Minimal markdown renderer — no external deps
function renderMarkdown(md: string): string {
  let html = md
    // Tables
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g, (_, header, rows) => {
      const ths = header.split('|').filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join('');
      const trs = rows.trim().split('\n').map((row: string) =>
        `<tr>${row.split('|').filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join('')}</tr>`
      ).join('');
      return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    })
    // H3
    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 id="$1">$2</h2>')
    // H1
    .replace(/^# (.+)$/gm, '<h1 id="$1">$2</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n(?!<)/g, '</p><p>')
    .replace(/^(?!<)(.+)/gm, (m) => m.startsWith('<') ? m : m);

  // Fix h2 id issue from regex above
  html = html.replace(/<h2 id="(.+?)">(.+?)<\/h2>/g, (_, id, text) => {
    const safeId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${safeId}">${text}</h2>`;
  }).replace(/<h3 id="(.+?)">(.+?)<\/h3>/g, (_, id, text) => {
    const safeId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h3 id="${safeId}">${text}</h3>`;
  });

  return `<p>${html}</p>`;
}

export default function ArticleContent({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div className="article-prose" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
