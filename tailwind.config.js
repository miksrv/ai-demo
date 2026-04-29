import { tailwindConfig as jskitTailwindConfig } from '@servicepattern/ui/src/tailwind/tailwind.config'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/@servicepattern/**/*.{ts,tsx}'
    ],
    plugins: [...jskitTailwindConfig.plugins, require('tailwindcss-animate')],
    theme: {
        ...jskitTailwindConfig.theme,
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            ...jskitTailwindConfig.theme.extend,
            colors: {
                ...jskitTailwindConfig.theme.extend.colors
            },
            boxShadow: {
                'side-panel': '-16px 4px 20px 0 hsla(0,0%,68%,.15)',
                'footer-toolbar': '0 -4px 20px 0 hsla(0,0%,68%,.15)'
            },
            fontSize: {
                small: '12px'
            },
            animation: {
                'loader-part-1': 'loader-spin-1 1.5s linear infinite',
                'loader-part-2': 'loader-spin-2 1.5s linear infinite',
                'loader-part-3': 'loader-spin-3 1.5s linear infinite',
                'loader-part-4': 'loader-spin-4 1.5s linear infinite',
                'toast-out': 'toast-out 150ms ease-out'
            },
            keyframes: {
                'loader-spin-1': {
                    '100%': { transform: `rotate(360deg)` }
                },
                'loader-spin-2': {
                    '0%': { transform: `rotate(0)` },
                    '11%': { transform: `rotate(0)` },
                    '100%': { transform: `rotate(360deg)` }
                },
                'loader-spin-3': {
                    '0%': { transform: `rotate(0)` },
                    '22%': { transform: `rotate(0)` },
                    '100%': { transform: `rotate(360deg)` }
                },
                'loader-spin-4': {
                    '0%': { transform: `rotate(0)` },
                    '33%': { transform: `rotate(0)` },
                    '100%': { transform: `rotate(360deg)` }
                },
                'toast-out': {
                    '0%': { opacity: '1', maxHeight: '102px' },
                    '100%': { opacity: '0', maxHeight: '0' }
                }
            }
        }
    }
}
