import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: './lib/index.js',
  output: [
    {
      exports: 'auto',
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    'path', 'fs', 'util', 'url'
  ]
};
