import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen, setCurrentView } from '../../models/uiSlice';
import { resetAutomaton, setType } from '../../models/automatonSlice';
import StatusBadge from './StatusBadge'; // Importar o componente

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, currentView } = useSelector((state) => state.ui);
  const { type: automatonType, states, transitions, alphabet } = useSelector((state) => state.automaton);

  // Converter objetos para arrays para contar
  const statesCount = Object.keys(states || {}).length;
  const transitionsCount = Object.keys(transitions || {}).length;
  const alphabetCount = alphabet?.length || 0;

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-dark-700 dark:to-dark-800 shadow-xl border-r border-gray-200 dark:border-dark-600 flex flex-col">
      {/* Header melhorado */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <div className="w-2 h-6 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mr-3"></div>
          Navegação
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Escolha a seção para trabalhar
        </p>
      </div>

      {/* Navegação com design melhorado */}
      <nav className="flex-1 p-4 space-y-3">
        <button
          onClick={() => dispatch(setCurrentView('editor'))}
          className={`group w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${currentView === 'editor'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-800/30'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-200 hover:shadow-md'
            }`}
        >
          <div className={`p-2 rounded-lg mr-3 transition-colors ${currentView === 'editor'
              ? 'bg-white/20'
              : 'bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Editor</div>
            <div className={`text-xs opacity-75 ${currentView === 'editor' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Construir autômatos
            </div>
          </div>
        </button>

        <button
          onClick={() => dispatch(setCurrentView('simulator'))}
          className={`group w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${currentView === 'simulator'
              ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-200 dark:shadow-secondary-800/30'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-200 hover:shadow-md'
            }`}
        >
          <div className={`p-2 rounded-lg mr-3 transition-colors ${currentView === 'simulator'
              ? 'bg-white/20'
              : 'bg-secondary-100 dark:bg-secondary-900/30 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800/50'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Simulador</div>
            <div className={`text-xs opacity-75 ${currentView === 'simulator' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Testar cadeias
            </div>
          </div>
        </button>

        <button
          onClick={() => dispatch(setCurrentView('tutorial'))}
          className={`group w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${currentView === 'tutorial'
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-200 dark:shadow-accent-800/30'
              : 'hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-200 hover:shadow-md'
            }`}
        >
          <div className={`p-2 rounded-lg mr-3 transition-colors ${currentView === 'tutorial'
              ? 'bg-white/20'
              : 'bg-accent-100 dark:bg-accent-900/30 group-hover:bg-accent-200 dark:group-hover:bg-accent-800/50'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Documentação</div>
            <div className={`text-xs opacity-75 ${currentView === 'tutorial' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Guias e ajuda
            </div>
          </div>
        </button>
      </nav>

      {/* Seletor de tipo melhorado */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2"></div>
          Tipo de Autômato
        </h3>
        <div className="relative inline-flex bg-gray-200 dark:bg-dark-700 rounded-xl p-1 w-full shadow-inner">
          <button
            className={`relative flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${automatonType === 'dfa'
                ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-md transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            onClick={() => dispatch(setType('dfa'))}
          >
            <div className="flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${automatonType === 'dfa' ? 'bg-primary-500' : 'bg-gray-400'
                }`}></div>
              AFD
            </div>
            {automatonType === 'dfa' && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 rounded-full"></div>
            )}
          </button>
          <button
            className={`relative flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${automatonType === 'nfa'
                ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-md transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            onClick={() => dispatch(setType('nfa'))}
          >
            <div className="flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${automatonType === 'nfa' ? 'bg-primary-500' : 'bg-gray-400'
                }`}></div>
              AFN
            </div>
            {automatonType === 'nfa' && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 rounded-full"></div>
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {automatonType === 'dfa'
            ? 'Determinístico - uma transição por símbolo'
            : 'Não-determinístico - múltiplas transições possíveis'
          }
        </div>
      </div>

      {/* Área de ações melhorada */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-600 save-load-buttons bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900">
        <div className="space-y-3">

          {/* Botão de reset melhorado */}
          <button
            className="group w-full py-2 px-3 rounded-lg text-sm font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-300 dark:hover:from-red-800/70 dark:hover:to-red-700/70 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-red-200 dark:border-red-700"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja resetar o autômato? Todas as alterações serão perdidas.')) {
                dispatch(resetAutomaton());
              }
            }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resetar Autômato
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;