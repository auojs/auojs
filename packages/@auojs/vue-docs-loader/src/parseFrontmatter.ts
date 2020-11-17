import matter from 'gray-matter';

export function parseFrontmatter(content: string) {
  return matter(content);
}
