/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors:{
      customPurple:'#131639',
      customPinkDark:'#ae3476',
      customPink:'#ed4d87'
    }},
  },
  plugins: [],
}