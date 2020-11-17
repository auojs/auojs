/**
 * 把md中所有组件提取出来
 * 返回提起后的文本
 */

interface ParseCompoennt {
  components?: string[];
  content?: string;
}

export function parseComponent(
  content: string,
  callback?: (idx: number) => string
): ParseCompoennt {
  let com: ParseCompoennt = {};
  let i = 0;
  com.content = content.replace(/```vue([\s\S]*?)```/g, (metah, $1) => {
    if (!com.components) com.components = [];
    com.components.push($1);

    if (callback) {
      return callback(i++);
    }
    return '';
  });
  return com;
}
