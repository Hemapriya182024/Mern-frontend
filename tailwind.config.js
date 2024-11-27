import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      "light", // Default light theme
      {
        linkedin: {
          ...themes["light"], // Start with the light theme as a base
          primary: "#0A66C2", // LinkedIn Blue
          secondary: "#313335", // Dark Gray
          accent: "#F3F2EF", // Light Gray for accent
          neutral: "#FFFFFF", // White for cards and modals
          "base-100": "#F3F2EF", // Page background
          "base-content": "#000000", // Main text color
          info: "#005F8C", // A slightly darker blue for info
          success: "#0077B5", // LinkedIn approved success greenish-blue
          warning: "#FFD700", // Use gold for warnings
          error: "#E60023", // Use LinkedIn’s red for errors
        },
      },
    ],
  },
};
