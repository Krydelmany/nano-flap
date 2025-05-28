import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorMode } from '../../models/uiSlice';
import { resetAutomaton, setType } from '../../models/automatonSlice';
import AutomatonCanvas from './AutomatonCanvas';
import TransitionTable from './TransitionTable';
import AlphabetEditor from './AlphabetEditor';

const EditorView = () => {
  const dispatch = useDispatch();
  const { editorMode } = useSelector((state) => state.ui);
  const { alphabet, error, type, states, transitions } = useSelector((state) => state.automaton);

  // Estatísticas do autômato
  const stateCount = Object.keys(states).length;
  const transitionCount = Object.keys(transitions).length;
  const hasInitialState = Object.values(states).some(state => state.isInitial);
  const finalStateCount = Object.values(states).filter(state => state.isFinal).length;

  const handleReset = () => {
    if (window.confirm('Deseja resetar o autômato? Todas as alterações serão perdidas.')) {
      dispatch(resetAutomaton());
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header compacto */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Editor</h2>
          </div>
          
          <div className="flex space-x-2">
            {/* Seletor de tipo de autômato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => dispatch(setType('dfa'))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  type === 'dfa'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                AFD
              </button>
              <button
                onClick={() => dispatch(setType('nfa'))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  type === 'nfa'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                AFN
              </button>
            </div>

            {/* Seletor de modo de visualização */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => dispatch(setEditorMode('visual'))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  editorMode === 'visual'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Visual</span>
                </div>
              </button>
              <button
                onClick={() => dispatch(setEditorMode('table'))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  editorMode === 'table'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
                  </svg>
                  <span>Tabela</span>
                </div>
              </button>
            </div>

            {/* Botão de reset compacto */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
              title="Resetar"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Indicadores de status removidos - agora estão no header */}
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      {/* Editor de alfabeto compacto */}
      <div className="mb-3">
        <AlphabetEditor />
      </div>
      
      {/* Área principal de edição maximizada */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {editorMode === 'visual' ? (
          <AutomatonCanvas />
        ) : (
          <TransitionTable />
        )}
      </div>
    </div>
  );
};

export default EditorView;
