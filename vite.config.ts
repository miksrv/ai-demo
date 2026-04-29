import path from 'path'

import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const isMock = process.env.VITE_MOCK === 'true'

export default defineConfig({
    plugins: [react(), ...(isMock ? [] : [basicSsl()])],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        server: {
            deps: {
                inline: [/@servicepattern\/ui/, /@servicepattern\/gn-lib/, /lodash-es/]
            }
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html']
        }
    }
})
