import { containers } from './containers';

export interface DDescriptor {
  styles: any[];
  script: string;
  content: string;
  vue: any[];
}

const paramReg = /^(style|vue|script)[^\r\n\S]*(.*)$/;

export function parse(source: string) {
  const descriptor: DDescriptor = {
    styles: [],
    script: '',
    content: '',
    vue: []
  };

  descriptor.content = containers(source, {
    validate: (params: string) => {
      return !!params.trim().match(paramReg);
    },
    render: (info: string, content: string) => {
      const t = info.trim().match(paramReg);
      if (!t) return;

      switch (t[1]) {
        case 'vue':
          descriptor.vue.push(content);
          break;
        case 'script':
          descriptor.script = content;
          break;
        case 'style':
          descriptor.styles.push(parseStyle(info, content));
          break;
      }
    }
  });

  return { descriptor };
}

function parseStyle(info: string, content: string) {
  const tt = info.match(/[^\s]*\s*(.*)/);
  let tag = ' ';
  if (tt) tag += tt[1];
  const t = content.match(/```(.*)[\r\n]*([\S\s]*?)```/);
  if (t) {
    return `<style lang="${t[1]}"${tag}>\n${t[2].trim()}\n</style>`;
  }
  return '';
}
