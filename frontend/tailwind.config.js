const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#111114",
          orange: "#ff7a1a",
          pink: "#f43f7f",
          purple: "#6d28d9",
          white: "#ffffff",
        },
      },
      boxShadow: {
        panel: "0 18px 45px rgba(17, 17, 20, 0.08)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
