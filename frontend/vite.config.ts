import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// Le back sert ses routes a la racine (/auth, /posts...), donc chaque prefixe
// est proxifie explicitement pour eviter CORS en developpement.
const API_TARGET = 'http://localhost:3000';
const API_PREFIXES = ['/auth/', '/posts', '/users', '/comments', '/uploads', '/seed-images'];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // @petcircle/contracts est un workspace lie : Vite ne le pre-bundle pas par
  // defaut, et sa sortie CommonJS casserait l'import de schemas en dev.
  optimizeDeps: {include: ['@petcircle/contracts']},
  server: {
    port: 5173,
    proxy: Object.fromEntries(
      API_PREFIXES.map((prefix) => [prefix, {target: API_TARGET, changeOrigin: true}]),
    ),
  },
});
