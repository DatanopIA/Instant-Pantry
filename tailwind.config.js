/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3A5A40',
                    light: '#A3B18A',
                    soft: '#DAD7CD',
                },
                accent: {
                    DEFAULT: '#E2725B',
                    soft: '#FCF5EC',
                },
                main: '#2D3E33',
                muted: '#6B7280',
                'bg-main': '#FBFBF9',
            },
            borderRadius: {
                'lg': '28px',
                'xl': '36px',
            },
            boxShadow: {
                'soft': '0 10px 30px -10px rgba(58, 90, 64, 0.15)',
                'premium': '0 30px 60px -12px rgba(58, 90, 64, 0.12)',
            },
            animation: {
                'aurora-float': 'aurora-float 25s ease infinite alternate',
            },
            keyframes: {
                'aurora-float': {
                    '0%': { transform: 'scale(1) translate(0, 0)' },
                    '100%': { transform: 'scale(1.1) translate(2%, 2%)' },
                }
            }
        },
    },
    plugins: [],
}
