import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        // Проксі для розробки: /api запити перенаправляються на Express сервер
        proxy: {
            '/api': 'http://localhost:5000',
        },
    },
})
