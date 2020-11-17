import { containers } from './containers';
import { ANode } from '@auojs/utils';

export interface DDescriptor {
  styles: ANode[];
  script: ANode | null;
  content: string | null;
  vue: any[];
}

const paramReg = /^(style|vue|script)[^\r\n\S]*(.*)$/;

export function parse(source: string) {
  const descriptor: DDescriptor = {
    styles: [],
    script: null,
    content: null,
    vue: []
  };

  descriptor.content = containers(source, {
    validate: (params: string) => {
      return !!params.trim().match(paramReg);
    },
    render: (info: string, content: string) => {
      const t = info.trim().match(paramReg);
      if (!t) return;
      const tag = t[1];
      switch (tag) {
        case 'vue':
          descriptor.vue.push(content);
          break;
        case 'script':
          descriptor.script = { tag: tag, children: [{ text: content }] };
          break;
        case 'style':
          descriptor.styles.push({
            tag: tag,
            children: [{ text: content }]
          });
          break;
      }
    }
  });

  return { descriptor };
}

export function parseStyle(info: string, content: string) {
  const tt = info.match(/[^\s]*\s*(.*)/);
  let tag = ' ';
  if (tt) tag += tt[1];
  const t = content.match(/```(.*)[\r\n]*([\S\s]*?)```/);
  if (t) {
    return `<style lang="${t[1]}"${tag}>\n${t[2].trim()}\n</style>`;
  }
  return '';
}
