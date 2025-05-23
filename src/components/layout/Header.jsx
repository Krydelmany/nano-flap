import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, toggleSidebar, setCurrentView } from '../../models/uiSlice';
import { startTutorial } from '../../models/tutorialSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { theme, currentView } = useSelector((state) => state.ui);

  return (
    <header className="bg-white dark:bg-dark-700 shadow-md px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Simulador de Autômatos Finitos
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-1">
          <button 
            onClick={() => dispatch(setCurrentView('editor'))}
            className={`px-3 py-2 rounded-md ${
              currentView === 'editor' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-dark-600'
            }`}
          >
            Editor
          </button>
          
          <button 
            onClick={() => dispatch(setCurrentView('simulator'))}
            className={`px-3 py-2 rounded-md ${
              currentView === 'simulator' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-dark-600'
            }`}
          >
            Simulador
          </button>
          
          <button 
            onClick={() => dispatch(setCurrentView('tutorial'))}
            className={`px-3 py-2 rounded-md ${
              currentView === 'tutorial' 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-dark-600'
            }`}
          >
            Documentação
          </button>
        </nav>

        
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
