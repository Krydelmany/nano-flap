import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorMode } from '../../models/uiSlice';
import AutomatonCanvas from './AutomatonCanvas';
import TransitionTable from './TransitionTable';
import AlphabetEditor from './AlphabetEditor';

const EditorView = () => {
  const dispatch = useDispatch();
  const { editorMode } = useSelector((state) => state.ui);
  const { alphabet, error } = useSelector((state) => state.automaton);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Editor de Autômatos</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setEditorMode('visual'))}
            className={`px-3 py-1 rounded-md text-sm ${
              editorMode === 'visual'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => dispatch(setEditorMode('table'))}
            className={`px-3 py-1 rounded-md text-sm ${
              editorMode === 'table'
                ? 'bg-primary-600 text-white dark:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500'
            }`}
          >
            Tabela
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      <AlphabetEditor />
      
      <div className="flex-1 mt-4">
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
