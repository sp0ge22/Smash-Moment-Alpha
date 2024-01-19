/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        'custom': ['Bangers', 'system-ui'], // 'custom' is the class name you can use in your HTML
      },

      keyframes: {
        buzz: {
          '0%, 100%': { 
            transform: 'translate(0, 0)',
            backgroundColor: 'transparent' // or use 'color' for text color
          },
          '10%, 30%, 50%, 70%, 90%': { 
            transform: 'translate(-1px, -1px)',
            backgroundColor: 'red'
          },
          '20%, 40%, 60%, 80%': { 
            transform: 'translate(1px, 1px)',
            backgroundColor: 'red'
          },
        },
        // existing shake keyframes...
      },
      animation: {
        buzz: 'buzz 0.5s linear',
        // existing shake animation...
      },
    },
  }
};
