/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  // darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'primary': '#3A5913',
        'secondary': '#090808',
        'tertiary': '#475467',
        'fontPrimary': '#1D232A',
        'fontGreen': '#293F0D',
        'fontBlue': '#101828',
        'fontGrey': '#475467',
        'borderGreen': '#C2CCB6',
        'lightGreen': '#F0F3F1',
        'lightGrey': '#F6F8FA' 
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["light"],
  },

}
