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
    <div className="card">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Alfabeto</h3>
      
      <form onSubmit={handleAddSymbol} className="flex mb-4 alphabet-input">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Novo símbolo"
          className="input flex-1 mr-2"
          maxLength={1}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!newSymbol || alphabet.includes(newSymbol)}
        >
          Adicionar
        </button>
      </form>
      
      {alphabet.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {alphabet.map((symbol) => (
            <div
              key={symbol}
              className="px-3 py-1 bg-gray-100 rounded-full flex items-center dark:bg-dark-600"
            >
              <span className="mr-2 font-mono">{symbol}</span>
              <button
                onClick={() => dispatch(removeSymbol(symbol))}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                aria-label={`Remover símbolo ${symbol}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {type === 'nfa' && !alphabet.includes('ε') && (
            <button
              onClick={() => dispatch(addSymbol('ε'))}
              className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-500"
            >
              + Adicionar ε (transição vazia)
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum símbolo definido. Adicione símbolos ao alfabeto para começar.
        </p>
      )}
    </div>
  );
};

export default AlphabetEditor;
