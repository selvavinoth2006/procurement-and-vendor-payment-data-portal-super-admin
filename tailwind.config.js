/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        sage: {
          50:  '#f6faf7',
          100: '#eaf4ec',
          200: '#d4e9d8',
          300: '#aed2b5',
          400: '#7fb98a',
          500: '#5a9e6a',
        },
        surface: {
          50:  '#ffffff',
          100: '#f8fffe',
          200: '#f0faf5',
          300: '#e6f4ed',
          400: '#d1e9db',
        },
        text: {
          primary:   '#0f2419',
          secondary: '#2d5a3d',
          muted:     '#64958a',
          light:     '#9bbfb4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
        'brand':   '0 4px 14px -2px rgba(22,163,74,0.25)',
      },
      backgroundImage: {
        'dots': "radial-gradient(circle, #c8e6c9 1px, transparent 1px)",
        'hero': "linear-gradient(135deg, #f0fdf4 0%, #e6f4ed 40%, #d4e9d8 100%)",
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
      }
    },
  },
  plugins: [],
}
