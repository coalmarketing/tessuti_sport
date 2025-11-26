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
    // Custom plugin for dashed border utilities
    function ({ addUtilities, theme }) {
      const colors = theme("colors");
      const borderWidths = theme("borderWidth");

      // Create dashed border utilities
      const dashedBorderUtilities = {};

      // Custom SVG-based dashed border with longer dashes and more spacing
      const createDashedBorderSVG = (color, strokeWidth = 2) => {
        return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='dash' patternUnits='userSpaceOnUse' width='24' height='${strokeWidth}'%3e%3cpath d='m0,${
          strokeWidth / 2
        } l12,0' stroke='${encodeURIComponent(
          color
        )}' stroke-width='${strokeWidth}' stroke-linecap='round'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23dash)'/%3e%3c/svg%3e`;
      };

      // Basic dashed border classes with custom style
      dashedBorderUtilities[".border-dashed-custom"] = {
        border: "none",
        "background-image": `url("${createDashedBorderSVG("#6b7280", 2)}")`,
        "background-size": "24px 2px",
        "background-repeat": "repeat-x",
        "background-position": "top, bottom, left, right",
      };

      // Dashed border with specific sides using background approach
      dashedBorderUtilities[".border-t-dashed-custom-red"] = {
        "border-top": "none",
        "background-image": `linear-gradient(90deg, #E92429 50%, transparent 50%)`,
        "background-size": "36px 2.5px",
        "background-repeat": "repeat-x",
        "background-position": "top",
      };

      dashedBorderUtilities[".border-b-dashed-custom"] = {
        "border-bottom": "none",
        "background-image": `linear-gradient(90deg, #6b7280 50%, transparent 50%)`,
        "background-size": "36px 2.5px",
        "background-repeat": "repeat-x",
        "background-position": "bottom",
      };

      dashedBorderUtilities[".border-l-dashed-custom"] = {
        "border-left": "none",
        "background-image": `linear-gradient(0deg, #6b7280 50%, transparent 50%)`,
        "background-size": "2px 24px",
        "background-repeat": "repeat-y",
        "background-position": "left",
      };

      dashedBorderUtilities[".border-r-dashed-custom"] = {
        "border-right": "none",
        "background-image": `linear-gradient(0deg, #6b7280 50%, transparent 50%)`,
        "background-size": "2px 24px",
        "background-repeat": "repeat-y",
        "background-position": "right",
      };

      dashedBorderUtilities[".border-x-dashed-custom"] = {
        "border-left": "none",
        "border-right": "none",
        "background-image": `linear-gradient(0deg, #6b7280 50%, transparent 50%), linear-gradient(0deg, #6b7280 50%, transparent 50%)`,
        "background-size": "2px 24px, 2px 24px",
        "background-repeat": "repeat-y, repeat-y",
        "background-position": "left, right",
      };

      dashedBorderUtilities[".border-y-dashed-custom"] = {
        "border-top": "none",
        "border-bottom": "none",
        "background-image": `linear-gradient(90deg, #6b7280 50%, transparent 50%), linear-gradient(90deg, #6b7280 50%, transparent 50%)`,
        "background-size": "24px 2px, 24px 2px",
        "background-repeat": "repeat-x, repeat-x",
        "background-position": "top, bottom",
      };

      // Dashed border with width and color combinations (most common colors)
      const commonColors = {
        gray: {
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
        },
        red: {
          500: "#E92429",
        },
        green: {
          500: "#00A44F",
        },
        black: "#000000",
        white: "#ffffff",
      };

      // Generate utilities for common patterns with custom longer dashes
      Object.entries(commonColors).forEach(([colorName, colorVariants]) => {
        if (typeof colorVariants === "string") {
          // Single color value (like black, white)
          dashedBorderUtilities[`.border-2-dashed-${colorName}`] = {
            border: "none",
            "background-image": `linear-gradient(90deg, ${colorVariants} 60%, transparent 60%), linear-gradient(90deg, ${colorVariants} 60%, transparent 60%), linear-gradient(0deg, ${colorVariants} 60%, transparent 60%), linear-gradient(0deg, ${colorVariants} 60%, transparent 60%)`,
            "background-size": "20px 2px, 20px 2px, 2px 20px, 2px 20px",
            "background-repeat": "repeat-x, repeat-x, repeat-y, repeat-y",
            "background-position": "top, bottom, left, right",
          };
          dashedBorderUtilities[`.border-4-dashed-${colorName}`] = {
            border: "none",
            "background-image": `linear-gradient(90deg, ${colorVariants} 60%, transparent 60%), linear-gradient(90deg, ${colorVariants} 60%, transparent 60%), linear-gradient(0deg, ${colorVariants} 60%, transparent 60%), linear-gradient(0deg, ${colorVariants} 60%, transparent 60%)`,
            "background-size": "24px 4px, 24px 4px, 4px 24px, 4px 24px",
            "background-repeat": "repeat-x, repeat-x, repeat-y, repeat-y",
            "background-position": "top, bottom, left, right",
          };
        } else {
          // Color variants (like gray-300, gray-400, etc.)
          Object.entries(colorVariants).forEach(([variant, colorValue]) => {
            const className =
              variant === "500" ? colorName : `${colorName}-${variant}`;
            dashedBorderUtilities[`.border-2-dashed-${className}`] = {
              border: "none",
              "background-image": `linear-gradient(90deg, ${colorValue} 60%, transparent 60%), linear-gradient(90deg, ${colorValue} 60%, transparent 60%), linear-gradient(0deg, ${colorValue} 60%, transparent 60%), linear-gradient(0deg, ${colorValue} 60%, transparent 60%)`,
              "background-size": "20px 2px, 20px 2px, 2px 20px, 2px 20px",
              "background-repeat": "repeat-x, repeat-x, repeat-y, repeat-y",
              "background-position": "top, bottom, left, right",
            };
            dashedBorderUtilities[`.border-4-dashed-${className}`] = {
              border: "none",
              "background-image": `linear-gradient(90deg, ${colorValue} 60%, transparent 60%), linear-gradient(90deg, ${colorValue} 60%, transparent 60%), linear-gradient(0deg, ${colorValue} 60%, transparent 60%), linear-gradient(0deg, ${colorValue} 60%, transparent 60%)`,
              "background-size": "24px 4px, 24px 4px, 4px 24px, 4px 24px",
              "background-repeat": "repeat-x, repeat-x, repeat-y, repeat-y",
              "background-position": "top, bottom, left, right",
            };
          });
        }
      });

      // Top border specific utilities with custom longer dashes
      dashedBorderUtilities[".border-t-2-dashed-red"] = {
        "border-top": "none",
        "background-image": `linear-gradient(90deg, #E92429 60%, transparent 60%)`,
        "background-size": "20px 2px",
        "background-repeat": "repeat-x",
        "background-position": "top",
      };
      dashedBorderUtilities[".border-t-4-dashed-red"] = {
        "border-top": "none",
        "background-image": `linear-gradient(90deg, #E92429 60%, transparent 60%)`,
        "background-size": "24px 4px",
        "background-repeat": "repeat-x",
        "background-position": "top",
      };
      dashedBorderUtilities[".border-t-2-dashed-gray"] = {
        "border-top": "none",
        "background-image": `linear-gradient(90deg, #6b7280 60%, transparent 60%)`,
        "background-size": "20px 2px",
        "background-repeat": "repeat-x",
        "background-position": "top",
      };
      dashedBorderUtilities[".border-t-4-dashed-gray"] = {
        "border-top": "none",
        "background-image": `linear-gradient(90deg, #6b7280 60%, transparent 60%)`,
        "background-size": "24px 4px",
        "background-repeat": "repeat-x",
        "background-position": "top",
      };

      addUtilities(dashedBorderUtilities);
    },
  ],
};
