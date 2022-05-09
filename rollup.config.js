import pkg from './package.json';

console.log(Object.keys(pkg.dependencies).concat('fs'));

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
