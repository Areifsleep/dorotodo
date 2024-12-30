/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        romance: {
          50: "#fffffe",
          100: "#fefee0",
          200: "#fdf9ba",
          300: "#fcf27d",
          400: "#f8e638",
          500: "#e9d50e",
          600: "#c7bb02",
          700: "#a19a03",
          800: "#857f07",
          900: "#6e6b0c",
          950: "#494908",
        },

        pink2: {
          50: "#fcf4f4",
          100: "#fae9eb",
          200: "#f5d6db",
          300: "#eebbc3",
          400: "#e18b9a",
          500: "#d26178",
          600: "#bc4261",
          700: "#9e3250",
          800: "#852c48",
          900: "#722941",
          950: "#3f1220",
        },

        periwinkle: {
          50: "#f1f4fc",
          100: "#e6eaf9",
          200: "#d2d8f3",
          300: "#b8c1ec",
          400: "#989fe1",
          500: "#7e80d6",
          600: "#6a64c7",
          700: "#5b54ae",
          800: "#4a468d",
          900: "#403e71",
          950: "#262442",
        },

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
