import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleMenu, setCurrentView } from '../../models/uiSlice'; // Assumindo que setCurrentView e toggleMenu existem
import { setType } from '../../models/automatonSlice'; // Assumindo que setType existe

const TopBar = () => {
  const dispatch = useDispatch();
  const { theme, currentView } = useSelector((state) => state.ui);
  const { type: automatonType } = useSelector((state) => state.automaton);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className="bg-white dark:bg-dark-700 shadow-md p-2 flex justify-between items-center z-20">
      <div className="flex items-center">
        {/* Logo pode ser um SVG ou Img */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m0-12a9 9 0 110 18 9 9 0 010-18zM12 9a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Simulador de Autômatos</h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Seletor DFA/NFA */}
        <div className="flex rounded-md bg-gray-200 dark:bg-dark-600 p-1">
          <button 
            onClick={() => dispatch(setType('dfa'))}
            className={`px-3 py-1 text-sm rounded-md ${automatonType === 'dfa' ? 'bg-primary-500 text-white dark:bg-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'}`}
          >
            AFD
          </button>
          <button 
            onClick={() => dispatch(setType('nfa'))}
            className={`px-3 py-1 text-sm rounded-md ${automatonType === 'nfa' ? 'bg-primary-500 text-white dark:bg-primary-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'}`}
          >
            AFN
          </button>
        </div>

        {/* Botão de Tema */}
        <button onClick={handleThemeToggle} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        {/* Botão de Menu */}
        <button onClick={() => dispatch(toggleMenu())} aria-label="Open menu" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
