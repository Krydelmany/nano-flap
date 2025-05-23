import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen, setCurrentView } from '../../models/uiSlice';
import { resetAutomaton } from '../../models/automatonSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, currentView } = useSelector((state) => state.ui);
  const { type: automatonType } = useSelector((state) => state.automaton);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-dark-700 shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-dark-600">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navegação</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => dispatch(setCurrentView('editor'))}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
            currentView === 'editor'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editor
        </button>
        
        <button
          onClick={() => dispatch(setCurrentView('simulator'))}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
            currentView === 'simulator'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Simulador
        </button>
        
        <button
          onClick={() => dispatch(setCurrentView('tutorial'))}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
            currentView === 'tutorial'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Documentação
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-dark-600">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tipo de Autômato</h3>
        <div className="flex space-x-2 automaton-type-selector">
          <button
            className={`flex-1 py-2 px-3 rounded-md text-sm ${
              automatonType === 'dfa'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500'
            }`}
            onClick={() => dispatch({ type: 'automaton/setType', payload: 'dfa' })}
          >
            AFD
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-md text-sm ${
              automatonType === 'nfa'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500'
            }`}
            onClick={() => dispatch({ type: 'automaton/setType', payload: 'nfa' })}
          >
            AFN
          </button>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-dark-600 save-load-buttons">
        <div className="flex space-x-2">
          <button
            className="flex-1 py-2 px-3 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500"
            onClick={() => {
              // Implementar funcionalidade de salvar
              alert('Funcionalidade de salvar será implementada');
            }}
          >
            Salvar
          </button>
          <button
            className="flex-1 py-2 px-3 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500"
            onClick={() => {
              // Implementar funcionalidade de carregar
              alert('Funcionalidade de carregar será implementada');
            }}
          >
            Carregar
          </button>
        </div>
        
        <button
          className="w-full mt-2 py-2 px-3 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          onClick={() => {
            if (window.confirm('Tem certeza que deseja resetar o autômato? Todas as alterações serão perdidas.')) {
              dispatch(resetAutomaton());
            }
          }}
        >
          Resetar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
