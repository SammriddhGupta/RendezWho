/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      tilt: ["Tile Neon", "sans-serif"], // Custom Avern font
    },
  },
  plugins: [],
};