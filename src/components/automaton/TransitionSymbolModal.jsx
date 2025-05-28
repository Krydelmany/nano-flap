import React, { useState, useEffect, useRef } from 'react';

const TransitionSymbolModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableSymbols, 
  sourceState, 
  targetState 
}) => {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Resetar valor e focar no input quando o modal abrir
      setSymbol('');
      setError(null);
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Por favor, insira um símbolo');
      return;
    }

    if (!availableSymbols.includes(symbol.trim())) {
      setError(`Símbolo "${symbol}" não está no alfabeto`);
      return;
    }

    onConfirm(symbol.trim());
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Adicionar Transição
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Adicionando transição de 
                <span className="font-medium text-blue-600 dark:text-blue-400"> {sourceState} </span> 
                para 
                <span className="font-medium text-green-600 dark:text-green-400"> {targetState}</span>
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="symbol">
                Símbolo da Transição:
              </label>
              <input
                ref={inputRef}
                id="symbol"
                type="text"
                value={symbol}
                onChange={e => {
                  setSymbol(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                           text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600
                           leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Digite um símbolo"
                maxLength={5}
              />
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Símbolos disponíveis:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {availableSymbols.map(s => (
                  <button
                    key={s}
                    type="button"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md
                              hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors
                              text-gray-800 dark:text-gray-200"
                    onClick={() => setSymbol(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 border border-red-400 
                             dark:border-red-800 text-red-700 dark:text-red-400 rounded">
                {error}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex justify-end space-x-2 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                        bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                        rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                        rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransitionSymbolModal;
