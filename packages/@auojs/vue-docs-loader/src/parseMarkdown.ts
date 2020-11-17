import mdit from 'markdown-it';

const md = new mdit({
  html: true
});

export function parseMarkdown(content: string) {
  return md.render(content);
}
