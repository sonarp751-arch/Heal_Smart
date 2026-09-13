/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        head: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
        sub: ["'Libre Baskerville'", "serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        teal: {
          DEFAULT: "#0f6e56",
          light: "#1D9E75",
          mid:   "#5DCAA5",
          bg:    "#E1F5EE",
        },
        navy: {
          DEFAULT: "#042C53",
          mid:     "#185FA5",
          light:   "#E6F1FB",
        },
        amber: {
          DEFAULT: "#BA7517",
          light:   "#FAEEDA",
        },
        brand: {
          red:       "#A32D2D",
          "red-lt":  "#FCEBEB",
          surface:   "#f8faf9",
          border:    "rgba(15,110,86,0.12)",
          gray:      "#5F5E5A",
          "gray-dk": "#2C2C2A",
          "gray-lt": "#F1EFE8",
        },
      },
      boxShadow: {
        card:  "0 4px 24px rgba(15,110,86,0.08)",
        "card-lg": "0 20px 60px rgba(15,110,86,0.08)",
        float: "0 4px 16px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      animation: {
        float:  "float 3s ease-in-out infinite",
        float2: "float 3s ease-in-out 1s infinite",
        float3: "float 3s ease-in-out 0.5s infinite",
        fadeIn: "fadeIn 0.3s ease",
        bounce3:"bounce3 1.2s infinite",
        slideUp:"slideUp 0.3s ease",
      },
      keyframes: {
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        fadeIn:  { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        bounce3: { "0%,60%,100%": { transform: "translateY(0)" }, "30%": { transform: "translateY(-8px)" } },
        slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
