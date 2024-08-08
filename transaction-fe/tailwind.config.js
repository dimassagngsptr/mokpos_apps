/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        main: {
          blue: "#1A72DD",
          navy: "#2A3256",
          grey: "#D1D1D1",
          darkGrey: "#BDBDBD",
          red: "#F4261A",
        },
      },
    },
  },
  plugins: [],
});
