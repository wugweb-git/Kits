import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'figma:asset/f9dc26a47e5bf70b8cc0cb58506e6e83ba15efc9.png': path.resolve(__dirname, './src/assets/f9dc26a47e5bf70b8cc0cb58506e6e83ba15efc9.png'),
      'figma:asset/f74093c82e0ebc8a763f5aa1b28cb70db79a2621.png': path.resolve(__dirname, './src/assets/f74093c82e0ebc8a763f5aa1b28cb70db79a2621.png'),
      'figma:asset/f6fad76de9461f90687da1e8488f3b97416f53c8.png': path.resolve(__dirname, './src/assets/f6fad76de9461f90687da1e8488f3b97416f53c8.png'),
      'figma:asset/f696e50d914cf017f3f0dedc0a291546425bc149.png': path.resolve(__dirname, './src/assets/f696e50d914cf017f3f0dedc0a291546425bc149.png'),
      'figma:asset/c8365a9616fc11793e9771d988053597ea692897.png': path.resolve(__dirname, './src/assets/c8365a9616fc11793e9771d988053597ea692897.png'),
      'figma:asset/9996026088d4fa11677d60551b3a921eb29b9256.png': path.resolve(__dirname, './src/assets/9996026088d4fa11677d60551b3a921eb29b9256.png'),
      'figma:asset/5e1c759341d10d01cfc46434d6f5695cb0c730b6.png': path.resolve(__dirname, './src/assets/5e1c759341d10d01cfc46434d6f5695cb0c730b6.png'),
      'figma:asset/5bc4e618a080c6bf5bfc3a7402b6643b123885cf.png': path.resolve(__dirname, './src/assets/5bc4e618a080c6bf5bfc3a7402b6643b123885cf.png'),
      'figma:asset/203a84312764c875d96421e89cb7a492bb418a19.png': path.resolve(__dirname, './src/assets/203a84312764c875d96421e89cb7a492bb418a19.png'),
      'figma:asset/04477cbda1713d97acf3aace694c77ff7d2e5040.png': path.resolve(__dirname, './src/assets/04477cbda1713d97acf3aace694c77ff7d2e5040.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
