import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import webWorkerLoader from 'rollup-plugin-web-worker-loader';




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 
    // webWorkerLoader(),
  ],
  worker: {
    format: "es",
  }
})
