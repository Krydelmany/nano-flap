import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSymbol, removeSymbol } from '../../models/automatonSlice';

const AlphabetEditor = () => {
  const dispatch = useDispatch();
  const { alphabet, type } = useSelector((state) => state.automaton);
  const [newSymbol, setNewSymbol] = useState('');

  const handleAddSymbol = (e) => {
    e.preventDefault();
    if (newSymbol && !alphabet.includes(newSymbol)) {
      dispatch(addSymbol(newSymbol));
      setNewSymbol('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          Alfabeto
        </h3>
        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
          {alphabet.length} símbolos
        </span>
      </div>
      
      <form onSubmit={handleAddSymbol} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Símbolo"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          maxLength={3}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!newSymbol || alphabet.includes(newSymbol)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </form>
      
      {alphabet.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {alphabet.map((symbol) => (
            <div
              key={symbol}
              className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800 text-sm group hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/40 dark:hover:to-indigo-900/40 transition-colors"
            >
              <span className="font-mono font-medium mr-1">{symbol}</span>
              <button
                onClick={() => dispatch(removeSymbol(symbol))}
                className="text-purple-400 hover:text-red-500 dark:text-purple-500 dark:hover:text-red-400 transition-colors"
                aria-label={`Remover símbolo ${symbol}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Botão para epsilon apenas para AFN */}
          {type === 'nfa' && !alphabet.includes('ε') && (
            <button
              onClick={() => dispatch(addSymbol('ε'))}
              className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              ε
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum símbolo definido
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Adicione símbolos para criar transições
          </p>
        </div>
      )}
    </div>
  );
};

export default AlphabetEditor;
