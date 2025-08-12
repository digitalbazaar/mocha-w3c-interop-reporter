import {createRequire} from 'node:module';
import esbuild from '@mnrendra/rollup-plugin-esbuild';
import mixexport from '@mnrendra/rollup-plugin-mixexport';

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
  plugins: [
    esbuild(),
    mixexport()
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    'module', 'path', 'fs', 'util', 'url'
  ]
};
