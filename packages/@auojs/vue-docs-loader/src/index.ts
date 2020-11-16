import webpack from 'webpack';
import { parse } from './parse';
// import { createDOMString, ANode } from '@auojs/utils';

function loader(this: webpack.loader.LoaderContext, source: string) {
  const { descriptor } = parse(source);

  const { styles, script, content, vue } = descriptor;
  console.log(styles, script, content, vue, 'vue');

  // createDOMString();
  return source;
}

export default loader;
