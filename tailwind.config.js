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
        primary: '#5e42cf', /*#4a32a1*/
        secondary: '#FAFAFA',
        navbar: '#121314',
        card: '#0c0c0c', /*#212121 #121314*/
        main_background: '#171717' /*#202020 #191919*/
      },
    },
  },
  plugins: [],
};
