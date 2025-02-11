module.exports = {
    content: [
      "./app/root.tsx",
      "./src/**/*.{html,js,jsx,ts,tsx}", 
    ],
    theme: {
    extend: {
        colors: {
        'main': '#333333',
        'secondary': '#D4AF37',
        },

        width: {
          '1/2':"50%"
        }
    },
    },
    plugins: [],
}
