import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Le back sert son API sous /api et ses fichiers statiques a la racine. Tout
// autre chemin appartient au routeur React.
const API_TARGET = 'http://localhost:3000';
const API_PREFIXES = ['/api', '/uploads', '/seed-images'];

export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: { include: ['@petcircle/contracts'] },
    server: {
        port: 5173,
        proxy: Object.fromEntries(
            API_PREFIXES.map((prefix) => [prefix, { target: API_TARGET, changeOrigin: true }]),
        ),
    },
});
