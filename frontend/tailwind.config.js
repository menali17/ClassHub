const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#FFA500",
          400: "#FFBF40",
          300: "#FFD580",
          100: "#FFECC2",
        },
        purple: {
          700: "#800080",
          500: "#A64CA6",
          300: "#C999C9",
          100: "#EBD6EB",
        },
        neutral: {
          900: "#000000",
          700: "#404040",
          500: "#808080",
          200: "#D9D9D9",
        },
        success:  "#16a34a",
        warning:  "#d97706",
        error:    "#dc2626",
        info:     "#0ea5e9",
        bg: {
          light:  "#f7f7fa",
          card:   "#ffffff",
          border: "#e4e4e9",
          muted:  "#6b6b80",
        },
        dark: {
          bg:     "#0f0f12",
          card:   "#1b1b1d",
          border: "#2a2a32",
          muted:  "#888898",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["3rem",    { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem",    { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1rem",    { lineHeight: "1.3", fontWeight: "600" }],
        body: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
        btn: ["0.875rem", { lineHeight: "1.0", fontWeight: "700" }],
      },
      boxShadow: {
        panel: "0 18px 45px rgba(17, 17, 20, 0.08)",
        card:  "0 2px 8px rgba(17, 17, 20, 0.06)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

module.exports = config;
