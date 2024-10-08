import fs from 'fs';
import path from 'path';

import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';

export default [
  {
    input: 'src/pages/options/index.ts',
    output: {
      file: 'dist/js/options.js',
      format: 'esm',
    },
    plugins: [
      clear({ targets: ['dist'] }),

      typescript(),

      {
        name: 'copy-options.html',
        generateBundle: () => {
          fs.mkdirSync('dist/pages', { recursive: true });
          fs.cpSync('src/pages/options/index.html', 'dist/pages/options.html');
        },
      },
    ],
  },
  {
    input: 'src/contentScript/baidu.ts',
    output: {
      file: 'dist/js/contentScript/baidu.js',
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: 'src/contentScript/bing.ts',
    output: {
      file: 'dist/js/contentScript/bing.js',
      format: 'esm',
    },
    plugins: [
      typescript(),
      copy({ targets: [{ src: 'src/manifest.json', dest: 'dist' }] }),

      {
        name: 'copy-assets',
        generateBundle: () => {
          const assets = fs.readdirSync('src/assets');
          assets.forEach((file) => {
            const oldPath = path.resolve('src/assets', file);
            const newPath = path.resolve('dist', file);
            if (fs.statSync(oldPath).isFile()) {
              fs.cpSync(oldPath, newPath);
            } else {
              fs.mkdirSync(newPath);
              fs.cpSync(oldPath, newPath, { recursive: true });
            }
          });
        },
      },
    ],
  },
];
