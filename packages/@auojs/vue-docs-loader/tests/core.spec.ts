// import { bundle } from './utils';
import fs from 'fs';
import path from 'path';
import loader from '../src/index';

test('ceshi', () => {
  const mdStr = fs.readFileSync(path.resolve(__dirname, 'fixtures/basic.md')).toString();
  loader.bind({} as any)(mdStr);
});

// test('sum', () => {
//   bundle({ entry: 'basic.md' });
// });
