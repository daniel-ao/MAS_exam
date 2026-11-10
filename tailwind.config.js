/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#F2ECE1',
          300: '#E7DEC8',
        },
        academic: {
          teal: '#0F766E',
          tealLight: '#F0FDFA',
          blue: '#1D4ED8',
          blueLight: '#EFF6FF',
          slate: '#334155',
          gold: '#B45309',
          goldLight: '#FFFBEB',
          green: '#15803D',
          greenLight: '#F0FDF4',
          rose: '#BE123C',
          roseLight: '#FFF1F2'
        }
      },
      boxShadow: {
        '2xs': '0 1px 0 0 rgb(0 0 0 / 0.04)',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.06)',
      },
      borderWidth: {
        3: '3px',
      },
      spacing: {
        0.2: '0.05rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

