/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#5e42cf',
        secondary: '#FAFAFA',
        navbar: '#121314',
        card: '#212121',
        main_background: '#191919' /*#202020 #191919*/
      }
    },
  },
  plugins: [],
};
