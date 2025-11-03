/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from "fluid-tailwind";
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  theme: {
    fontSize: fontSize,
    screens: screens,
    extend: {
      fontFamily: {
        sans: ["Poppins", defaultTheme.fontFamily.sans],
        Gabarito: ["Gabarito", "sans-serif"],
        RedHatText: ["Red Hat Text", "sans-serif"],
      },
      colors: {
        primary: "#E11D48",
      },
    },
  },
  plugins: [
    fluid,
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
  ],
};
