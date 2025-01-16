/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        twinkle: "twinkle 3s infinite",
        meteor: "meteor 5s infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: 1 },
        },
        meteor: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: 1 },
          "100%": {
            transform: "translateY(50px) translateX(-100px)",
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
};
