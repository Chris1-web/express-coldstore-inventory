/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{pug, html}"],
  theme: {
    extend: {
      height: (theme) => ({
        "custom-screen-80": "80vh",
      }),
      colors: {
        "custom-yellow": "#F4EDE8",
        "custom-blue": "2E2BA8",
      },
    },
  },
  plugins: [],
};
