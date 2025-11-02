import { plugin } from "postcss";
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'os-primary' : 'var(--os-primary)',
                'os-secondary' : 'var(--os-secondary)',
                'os-tertiary' : 'var(--os-tertiary)',
                'os-black' : 'var(--os-black)',
                'os-white' : 'var(--os-white)',
                'os-warning' : 'var(--os-warning)',
                'os-edit' : 'var(--os-edit)',
                'os-danger' : 'var(--os-danger)',
                'os-neutral' : 'var(--os-neutral)',
                'os-success' : 'var(--os-success)',

            },
            opacity: {
                'os-alpha-100': 'var(--os-alpha-100)',
                'os-alpha-75': 'var(--os-alpha-75)',
                'os-alpha-25': 'var(--os-alpha-25)',
                'os-alpha-0': 'var(--os-alpha-0)',
            },
            spacing: {
                "os-48": "var(--os-48)",
                "os-36": "var(--os-36)",
                "os-24": "var(--os-24)",
                "os-20": "var(--os-20)",
                "os-14": "var(--os-14)",
                "os-12": "var(--os-12)",
                "os-8": "var(--os-8)",
                "os-4": "var(--os-4)",
                "os-2": "var(--os-2)",
            },
            fontSize: {
                'os-title': 'var(--os-title)',
                'os-subtitle': 'var(--os-subtitle)',
                'os-regular': 'var(--os-regular)',
                'os-paragraft': 'var(--os-paragraft)',
                'os-small': 'var(--os-small)',
            },
            borderWidth: {
                'os-1': 'var(--os-1)',
                'os-2': 'var(--os-2)',
            },
            borderColor: {
                'os-primary' : 'var(--os-primary)'  ,
            }

        },
    },
    plugins: [
        plugin(function ({ addUtilities, theme }) {
            const newUtilities = {
                ".os-icon-dark": {
                filter:
                    "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                },
                ".os-icon-light": {
                filter:
                    "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                },
            };
            addUtilities(newUtilities, ["responsive", "hover"]);
        }),
    ],
};
