export interface ANodeDate {
  [x: string]: any;
}

export interface ANode {
  tag?: string;
  // 标签属性
  data?: ANodeDate;
  // 子项目
  children?: Array<ANode>;
  // tag标签无内容时
  text?: string;
}

/**
 * 创建DOM文本
 * @param node
 */
export function createDOMString(node: ANode): string {
  const { tag, data, children, text } = node;

  if (!tag) return text || '';

  // data
  let attrs = '';
  if (data) {
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        attrs += ` ${key}="${data[key]}"`;
      } else {
        attrs += ` ${key}`;
      }
    });
  }

  // content
  let content = '';
  if (children) {
    children.forEach((item) => {
      content += createDOMString(item);
    });
  }

  return `<${tag}${attrs}>${content || text}</${tag}>`;
}
