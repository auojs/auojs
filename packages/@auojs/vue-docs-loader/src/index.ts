import webpack from 'webpack';
import loaderUtils from 'loader-utils';
// import { parse } from './parse';
import * as qs from 'querystring';
import { createDOMString, ANode } from '@auojs/utils';
import { parseFrontmatter } from './parseFrontmatter';
import { parseComponent } from './parseComponent';
import { parseMarkdown } from './parseMarkdown';

interface MDStyleConfig {
  lang?: string;
  body?: string;
  scoped?: boolean;
  [x: string]: any;
}

interface MDConfig {
  style?: string | MDStyleConfig;
}

function loader(this: webpack.loader.LoaderContext, source: string) {
  const loaderContext = this;
  const stringifyRequest = (r: string) => loaderUtils.stringifyRequest(loaderContext, r);

  const { resourcePath, resourceQuery } = loaderContext;
  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = qs.parse(rawQuery);

  if (incomingQuery.md === 'vue' && incomingQuery.mdidx != null) {
  }

  const matter = parseFrontmatter(source.trim());

  const { data, content } = matter;

  // style
  let styNode: ANode = { tag: 'style', data: {} };
  if (data) {
    const { style }: MDConfig = data;
    if (style) {
      if (typeof style === 'string') {
        styNode.children = [{ text: style }];
      } else if (style) {
        Object.keys(style).forEach((key) => {
          if (key === 'body') {
            styNode.children = [{ text: style[key] }];
          } else {
            if (!styNode.data) styNode.data = {};
            if (typeof style[key] === 'boolean' && style[key]) {
              styNode.data[key] = '';
            } else {
              styNode.data[key] = style[key];
            }
          }
        });
      }
    }
  }

  // 组件
  let imports = '';
  let components: any[] = [];
  const comp = parseComponent(content, (idx) => {
    const name = `auojs_docs_${idx}`;
    const demoPath = stringifyRequest(resourcePath + '?md=vue&mdidx=' + idx);
    imports += `import ${name} from '${demoPath}';\n`;
    components.push(name);
    return `<${name} />\n`;
  });

  const { content: str } = comp;

  // const { descriptor } = parse(content);

  let code = '';
  if (str) {
    code += createDOMString({ tag: 'template', children: [{ text: parseMarkdown(str) }] }) + '\n';
  }

  if (styNode.children) {
    code += createDOMString(styNode);
  }

  const script = { components: { ...components } };

  code += createDOMString({
    tag: 'script',
    children: [{ text: `${imports}\nexport default ${JSON.stringify(script)}` }]
  });

  console.log(code);

  /**
   * <template>
   *
   * </template>
   *
   * <script>
   *
   * </script>
   *
   * <style>
   *
   * </style>
   */

  return code;
}

export default loader;
