import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F0EFEC",
        mist: "#E7E3D8",
        sand: "#D2CCC1",
        clay: "#BBA794",
        oak: "#9B8877",
        espresso: "#433021",
      },
      boxShadow: {
        panel: "0 20px 60px -25px rgba(67, 48, 33, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
