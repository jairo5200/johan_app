import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: 'class', // Habilita el modo oscuro a través de una clase
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Estos colores se usarán para elementos generales
          light: '#f0f0f0',  // Color para el modo claro (por ejemplo, un fondo suave)
          dark: '#1a202c',   // Color para el modo oscuro
        },
        secondary: {
          // Por ejemplo, para el navbar u otros elementos específicos
          light: '#e0f2fe',  // Un azul muy claro para el modo claro (puedes ajustar a tu gusto)
          dark: '#2d3748',   // Un tono más oscuro para el modo oscuro
        },
      },
      animation: {
        flicker: 'flicker 1.5s infinite ease-in-out',
        'bg-flicker': 'background-flicker 1.2s infinite ease-in-out',
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },


  plugins: [forms, typography],
};
  // theme: {
  //   extend: {
  //     animation: {
  //       flicker: 'flicker 1.5s infinite ease-in-out',
  //       'bg-flicker': 'background-flicker 1.2s infinite ease-in-out',
  //     },
  //     fontFamily: {
  //       sans: ['Figtree', ...defaultTheme.fontFamily.sans],
  //     },
  //   },
  // },
