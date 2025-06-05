/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
    "./src/utils/**/*.{js,jsx}",
    "./src/**/*"
  ],
  safelist: [
    // Animasyon sınıfları
    'animate-fade-in',
    'animate-slide-up', 
    'animate-stagger-1',
    'animate-stagger-2',
    'animate-stagger-3',
    'animate-stagger-4',
    'hover-lift',
    'hover-scale',
    'hover-glow',
    'card-animate',
    // Button sınıfları
    'btn-primary',
    'btn-secondary', 
    'btn-danger',
    'btn-success',
    'btn-whatsapp',
    'btn-fab',
    // Primary renkler
    {
      pattern: /^(bg|text|border|ring)-primary-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Hover states
    {
      pattern: /^hover:(bg|text|border|ring)-primary-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Focus states  
    {
      pattern: /^focus:(bg|text|border|ring)-primary-(50|100|200|300|400|500|600|700|800|900)$/,
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
