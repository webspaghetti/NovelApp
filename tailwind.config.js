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
        card: '#0c0c0c', /*#212121 #121314*/
        main_background: '#171717' /*#202020 #191919*/
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px'
      },
      maxWidth:{
        '30': '30rem',
      },
      height:{
        '100': '20rem',
        '101': '27rem',
        '75': '19rem',
      },
      width:{
        '100': '35rem',
      }
    },
  },
  plugins: [],
};
