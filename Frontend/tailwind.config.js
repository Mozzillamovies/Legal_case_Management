/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 This enables Tailwind in JSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
