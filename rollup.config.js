import fs from 'fs';
import path from 'path';

import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';

export default [
  {
    input: 'src/pages/options/index.ts',
    output: { file: 'dist/options/options.js' },
    plugins: [clear({ targets: ['dist'] }), typescript()],
  },
  {
    input: 'src/background.ts',
    output: { file: 'dist/background.js' },
    plugins: [typescript()],
  },
  {
    input: 'src/contentScript/xhrInterceptor.ts',
    output: { file: 'dist/scripts/xhrInterceptor.js' },
    plugins: [typescript()],
  },
  {
    input: 'src/contentScript/baidu.ts',
    output: { file: 'dist/scripts/baidu.js' },
    plugins: [typescript()],
  },
  {
    input: 'src/contentScript/bing.ts',
    output: { file: 'dist/scripts/bing.js' },
    plugins: [
      typescript(),

      {
        name: 'copy-assets',
        generateBundle: () => {
          // copy options.html
          fs.cpSync('src/pages/options/index.html', 'dist/options/options.html');

          // copy assets
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
      {
        name: 'generate-manifest.json',
        generateBundle: () => {
          let manifest = JSON.parse(fs.readFileSync('./src/manifest.common.json'));
          const target = process.env.TARGET;

          if (target === 'chrome') {
            const chrome = JSON.parse(fs.readFileSync('./src/manifest.chrome.json'));

            manifest = { ...manifest, ...chrome };
          } else if (target === 'firefox') {
            const firefox = JSON.parse(fs.readFileSync('./src/manifest.firefox.json'));

            manifest = { ...manifest, ...firefox };
          }

          fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, '', '\t'), 'utf-8');
        },
      },
    ],
  },
];
