/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          deep: '#072D44',       // Dark Navy / Midnight Blue from image
          primary: '#064469',    // Rich Ocean Blue from image
          hover: '#053755',      // Hover shade
          light: '#F0F6FA',      // Soft clean tint
          border: '#D5E4EE',     // Subtle border tint
          white: '#FFFFFF',      // Crisp White
        },
      },
    },
  },
  plugins: [],
};
