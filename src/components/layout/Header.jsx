import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, toggleSidebar, setCurrentView, toggleMenu } from '../../models/uiSlice';
import { startTutorial } from '../../models/tutorialSlice';
import CreditsModal from './CreditsModal';

const Header = () => {
  const dispatch = useDispatch();
  const { theme, currentView } = useSelector((state) => state.ui);
  const { states, transitions, alphabet } = useSelector((state) => state.automaton);
  const [showCredits, setShowCredits] = useState(false);

  // Contadores e validações
  const stateCount = Object.keys(states).length;
  const transitionCount = Object.keys(transitions).length;
  const hasInitialState = Object.values(states).some(state => state.isInitial);
  const finalStateCount = Object.values(states).filter(state => state.isFinal).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Nano Flap
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Simulador de Autômatos</p>
          </div>
        </div>

        {/* Badge expandido com validações */}
        {(stateCount > 0 || transitionCount > 0) && (
          <div className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{stateCount} estados</span>
            </div>
            <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{transitionCount} transições</span>
            </div>
          </div>
        )}

        {/* Indicadores de validação */}
        <div className="hidden md:flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            hasInitialState 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            {hasInitialState ? '✓' : '⚠'} Inicial
          </span>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            finalStateCount > 0
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
          }`}>
            {finalStateCount > 0 ? `✓ ${finalStateCount}` : '⚠'} Final{finalStateCount !== 1 ? 'is' : ''}
          </span>

          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            alphabet.length > 0
              ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}>
            {alphabet.length > 0 ? `✓ {${alphabet.slice(0, 3).join(',')}}${alphabet.length > 3 ? '...' : ''}` : '⚠ Alfabeto'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Navegação principal */}
        <nav className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            onClick={() => dispatch(setCurrentView('editor'))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === 'editor' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editor</span>
            </div>
          </button>
          
          <button 
            onClick={() => dispatch(setCurrentView('simulator'))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === 'simulator' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M5 18h14" />
              </svg>
              <span>Simulador</span>
            </div>
          </button>
          
          <button 
            onClick={() => dispatch(setCurrentView('tutorial'))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === 'tutorial' 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Docs</span>
            </div>
          </button>
        </nav>

        {/* Botões de ação */}
        <div className="flex items-center space-x-1">


          <button 
            onClick={() => setShowCredits(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            aria-label="Créditos"
            title="Créditos"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          <button 
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Créditos */}
      <CreditsModal 
        isOpen={showCredits} 
        onClose={() => setShowCredits(false)} 
      />
    </header>
  );
};

export default Header;
