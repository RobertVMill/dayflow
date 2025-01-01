import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        vision: {
          primary: '#8A4726',
          secondary: '#5C2E17',
          surface: '#1c1c1e',
          'surface-dark': '#000000',
          accent: '#B85C2C',
          'accent-light': '#D47341',
          muted: '#A3785D'
        }
      },
      stroke: {
        'vision-primary': '#8A4726',
        'vision-secondary': '#5C2E17'
      },
      fill: {
        'vision-primary': '#8A4726',
        'vision-secondary': '#5C2E17'
      },
      backgroundColor: {
        'vision-primary': '#8A4726',
        'vision-secondary': '#5C2E17'
      },
      gradientColorStops: {
        'vision-primary': '#8A4726',
        'vision-secondary': '#5C2E17'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backdropBlur: {
        'vision': '20px',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
