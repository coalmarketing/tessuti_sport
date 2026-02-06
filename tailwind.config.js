/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from "fluid-tailwind";
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  safelist: ["product-icons", "product-icon-wrapper", "icon-tooltip"],
  theme: {
    fontSize: fontSize,
    screens: screens,
    // Scale spacing to 90% to match the 90% root font-size reduction
    spacing: {
      px: "1px",
      0: "0px",
      0.5: "0.113rem", // 90% of 0.125rem (2px)
      1: "0.225rem", // 90% of 0.25rem (4px)
      1.5: "0.338rem", // 90% of 0.375rem (6px)
      2: "0.45rem", // 90% of 0.5rem (8px)
      2.5: "0.563rem", // 90% of 0.625rem (10px)
      3: "0.675rem", // 90% of 0.75rem (12px)
      3.5: "0.788rem", // 90% of 0.875rem (14px)
      4: "0.9rem", // 90% of 1rem (16px)
      5: "1.125rem", // 90% of 1.25rem (20px)
      6: "1.35rem", // 90% of 1.5rem (24px)
      7: "1.575rem", // 90% of 1.75rem (28px)
      8: "1.8rem", // 90% of 2rem (32px)
      9: "2.025rem", // 90% of 2.25rem (36px)
      10: "2.25rem", // 90% of 2.5rem (40px)
      11: "2.475rem", // 90% of 2.75rem (44px)
      12: "2.7rem", // 90% of 3rem (48px)
      14: "3.15rem", // 90% of 3.5rem (56px)
      16: "3.6rem", // 90% of 4rem (64px)
      20: "4.5rem", // 90% of 5rem (80px)
      24: "5.4rem", // 90% of 6rem (96px)
      28: "6.3rem", // 90% of 7rem (112px)
      32: "7.2rem", // 90% of 8rem (128px)
      36: "8.1rem", // 90% of 9rem (144px)
      40: "9rem", // 90% of 10rem (160px)
      44: "9.9rem", // 90% of 11rem (176px)
      48: "10.8rem", // 90% of 12rem (192px)
      52: "11.7rem", // 90% of 13rem (208px)
      56: "12.6rem", // 90% of 14rem (224px)
      60: "13.5rem", // 90% of 15rem (240px)
      64: "14.4rem", // 90% of 16rem (256px)
      72: "16.2rem", // 90% of 18rem (288px)
      80: "18rem", // 90% of 20rem (320px)
      96: "21.6rem", // 90% of 24rem (384px)
    },
    extend: {
      fontFamily: {
        sans: ["Red Hat Text", defaultTheme.fontFamily.sans],
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
        "border-radius": "0.75rem", // Same as rounded-xl (12px)
        "background-image": `linear-gradient(90deg, #6b7280 50%, transparent 50%), linear-gradient(90deg, #6b7280 50%, transparent 50%), linear-gradient(0deg, #6b7280 50%, transparent 50%), linear-gradient(0deg, #6b7280 50%, transparent 50%)`,
        "background-size": "36px 2px, 36px 2px, 2px 36px, 2px 36px",
        "background-repeat": "repeat-x, repeat-x, repeat-y, repeat-y",
        "background-position": "top, bottom, left, right",
        "background-clip": "padding-box",
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

      // Add typography utilities for consistent font usage
      const typographyUtilities = {
        // All headings use Gabarito font with tighter line-height
        "h1, h2, h3, h4, h5, h6": {
          "font-family": '"Gabarito", sans-serif',
          "line-height": "1.2",
        },
        // Utility classes for explicit font usage
        ".font-heading": {
          "font-family": '"Gabarito", sans-serif',
          "line-height": "1.2",
        },
        ".font-body": {
          "font-family": '"Red Hat Text", sans-serif',
          "line-height": "1.2",
        },
      };

      addUtilities(typographyUtilities);
    },
  ],
};
