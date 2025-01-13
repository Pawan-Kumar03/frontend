/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1170px",
                "2xl": "1170px",
            },
        },
        extend: {
            colors: {
                primary: {
                    400: "#fae4d4",
                    500: "#ffe3cf",
                    600: "#fcdbc2",
                },
                gray: {
                    100: "#f5f5f5",
                    200: "#e5e5e5",
                    300: "#d4d4d4",
                    400: "#a3a3a3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#262626",
                    900: "#171717",
                },
                custom: "#c5a47e",
            },
            fontFamily: {
                parkinsans: ["'Parkinsans'", "sans-serif"],
                playfair: ["'Playfair Display'", "serif"],
                impact: ["'Impact'", "sans-serif"],
                josefin: ["'Josefin Sans'", "sans-serif"],
                openSans: ["'Open Sans'", "sans-serif"],
                lato: ["'Lato'", "sans-serif"],
                aller: ['Aller', 'sans-serif'],
            },
            animation: {
                blink: 'blink 1s linear infinite',
            },
            keyframes: {
                blink: {
                    '0%': {
                        opacity: 1,
                    },
                    '50%': {
                        opacity: 0.5,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
            },
        },
    },
    plugins: [],
};
