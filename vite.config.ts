import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

const fullReloadAlways: PluginOption = {
  name: 'full-reload-always',
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
} as PluginOption

export default defineConfig({
  base: '#/random/webgputests/linked/',
  plugins: [
    react(),
    fullReloadAlways
  ],
  build: {
    target: 'esnext' // browsers can handle the latest ES features
  },
  esbuild: {
    target: 'esnext' // enables top-level await and other modern features
  },
  optimizeDeps: {
    exclude: ['three'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
})