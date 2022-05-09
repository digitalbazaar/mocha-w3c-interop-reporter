import pkg from './package.json';

export default {
  input: './lib/index.js',
  output: [
    {
      exports: 'auto',
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
    }
  ],
  external: Object.keys(pkg.dependencies).concat['path', 'fs', 'util']
};
