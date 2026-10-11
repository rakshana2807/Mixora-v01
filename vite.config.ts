import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

function copyStaticAssets(): Plugin {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const copyDir = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const item of fs.readdirSync(src)) {
          const srcPath = path.join(src, item);
          const destPath = path.join(dest, item);
          if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      const outDir = path.resolve(rootDir, 'dist');
      copyDir(path.resolve(rootDir, 'js'), path.join(outDir, 'js'));
      copyDir(path.resolve(rootDir, 'css'), path.join(outDir, 'css'));
    }
  };
}

export default defineConfig({
  plugins: [react(), copyStaticAssets()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        app: './app.html',
        menu: './menu.html',
        customizer: './customizer.html',
        lab: './lab.html',
        cart: './cart.html',
        checkout: './checkout.html',
        orders: './orders.html',
        profile: './profile.html',
        admin: './admin.html',
        adminLogin: './admin-login.html'
      }
    }
  }
});
