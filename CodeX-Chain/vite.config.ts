import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'node:path';
import ViteNode from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { NODE_ENV: mode, ...loadEnv(mode, process.cwd()) };

  return {
    define: {
      "process.env": env,
    },
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
      }),
      ViteNode,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'app/javascript/App/'),
        timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      },
    },
    server: {
      port: 3333,
    },
    preview: {
      port: 3333,
    },
    externals: {
      EventEmitter: 'events',
      monaco: 'monaco-editor',

    },
    rollupOptions: {
      external: ['__vite-browser-external', 'events'], // Add 'events' to the list
    },
    optimizeDeps: {
      exclude: ['@dfinity/identity', '@dfinity/candid', '@dfinity/principal', 'xterm-addon-fit'],
    },
  };
});
