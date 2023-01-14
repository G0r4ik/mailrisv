import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    bundleAnalyzer(),
    svelte(),
    viteStaticCopy({
      targets: [
        { src: './server.js', dest: '' },
        { src: './db.json', dest: '' },
      ],
    }),
  ],
})
