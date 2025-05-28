import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const StateContextMenu = ({ position, isOpen, onClose, onToggleInitial, onToggleFinal, onDelete, isInitial, isFinal }) => {
  // Fechar o menu quando clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (e) => onClose();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Usar portal para renderizar menu no nível superior do DOM
  return ReactDOM.createPortal(
    <div 
      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl py-1"
      style={{ 
        left: position.x, 
        top: position.y,
        zIndex: 99999,
        minWidth: '160px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleInitial();
        }}
        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isInitial ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {isInitial ? '✓ Estado inicial' : 'Marcar como inicial'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFinal();
        }}
        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isFinal ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {isFinal ? '✓ Estado final' : 'Marcar como final'}
      </button>
      <hr className="my-1 border-gray-200 dark:border-gray-600" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        🗑️ Excluir estado
      </button>
    </div>,
    document.body
  );
};

export default StateContextMenu;
