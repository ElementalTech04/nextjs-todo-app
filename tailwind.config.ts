import type { Config } from "tailwindcss";

const config: {
  plugins: any[];
  theme: {
    extend: {
      fontFamily: { poppins: string[] };
      colors: {
        red: string;
        lightGreen: string;
        darkGreen: string;
        background: string;
        yellow: string;
        mustard: string;
        black: string;
        foreground: string
      }
    }
  };
  content: string[]
} = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        red: "#C97064",
        yellow: "#F2C500",
        mustard: "#F59D00",
        lightGreen: "#68A357",
        darkGreen: "#034732",
        black: "#191919",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
