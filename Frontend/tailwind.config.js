/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'group-logo': "url('./public/images/group-logo.png')",
      },
      animation: {
        fade: "fadeEffect 3s ease-in-out",
      },
      keyframes: {
        fadeEffect: {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
}

