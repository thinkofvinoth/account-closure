/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          secondary: '#1E293B',
          surface: '#293548',
          text: '#E2E8F0',
          muted: '#94A3B8',
          accent: {
            DEFAULT: '#3B82F6',
            hover: '#2563EB',
          },
          accent2: {
            DEFAULT: '#8B5CF6',
            hover: '#7C3AED',
          },
          success: '#14B8A6',
          warning: '#F59E0B',
          error: '#E11D48',
          border: {
            DEFAULT: '#334155',
            hover: '#475569',
          }
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        }
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        'mesh-pattern': 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        'noise-pattern': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};