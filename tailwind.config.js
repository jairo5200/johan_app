import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilita el modo oscuro a través de una clase
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
        // Definimos colores para el light mode como valores predeterminados
        // background: '#414345', // Fondo general en modo claro
        body: '#333333',       // Color de texto principal en modo claro

        // Puedes seguir usando tus colores para elementos específicos
        primary: {
          light: '#D36135',  // Por ejemplo, fondo de botones o tarjetas
          dark: '#1a202c',   // Valor para modo oscuro
        },
        secondary: {
          light: '#CE4257',  // Por ejemplo, para el navbar u otros elementos
          dark: '#2d3748',   // Valor para modo oscuro
        },
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        flicker: 'flicker 1.5s infinite ease-in-out',
        'bg-flicker': 'background-flicker 1.2s infinite ease-in-out',
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
