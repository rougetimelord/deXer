import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest';

export default defineConfig(() => {
    return {
        build: {
            emptyOutDir: true,
            outDir: 'build',
            rollupOptions: {
                output: {
                    chunkFileNames: 'assets/chunk-[hash].js'
                }
            },
            target: 'esnext'
        },
        optimizeDeps: {
            include: ['./loader.js', './src/inject.js'],
        },
        plugins: [crx({manifest})],
        assetsInclude: ["./assets/*.png"]
    }
});