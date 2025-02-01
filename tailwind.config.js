/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "chat-bg":
          "url('https://img.freepik.com/premium-vector/web-icon-background-computer-vector-icon-background_645658-707.jpg')",
      },
    },
  },
  plugins: [],
};
