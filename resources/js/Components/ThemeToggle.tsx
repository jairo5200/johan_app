// import React, { useState, useEffect } from 'react';

// export default function ThemeToggle() {
//   // Lee la preferencia del tema desde localStorage, si existe.
//   const [darkMode, setDarkMode] = useState<boolean>(() => {
//     return localStorage.getItem('theme') === 'dark';
//   });

//   useEffect(() => {
//     const html = document.documentElement;
//     if (darkMode) {
//       html.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       html.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode((prev) => !prev);

//   return (
//     <button 
//       onClick={toggleTheme} 
//       className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
//     >
//       {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
//     </button>
//   );
// }
