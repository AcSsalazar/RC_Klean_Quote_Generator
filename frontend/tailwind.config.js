/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "../frontend/components/forms/**/*.{js,jsx,ts,tsx}",  // Incluye todos los archivos en 'forms' y subdirectorios
  "../frontend/components/**/*.{js,jsx,ts,tsx}",        // Incluye todos los archivos en 'components' y subdirectorios
];
export const theme = {
  extend: {},
};
export const plugins = [];
