import React, { memo, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import StateContextMenu from './StateContextMenu';

const StateNode = ({ data, selected }) => {
  const { state, onStateClick, onStateDelete, onStateUpdate, isSelected, isAddingTransition, selectedStateForTransition } = data;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onStateClick) {
      onStateClick(state.id);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Posicionamento mais preciso usando pageX/pageY
    setContextMenuPosition({ 
      x: e.pageX, 
      y: e.pageY 
    });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    if (onStateDelete) {
      onStateDelete(state.id);
    }
  };

  const toggleInitial = () => {
    if (onStateUpdate) {
      onStateUpdate(state.id, { isInitial: !state.isInitial });
    }
  };

  const toggleFinal = () => {
    if (onStateUpdate) {
      onStateUpdate(state.id, { isFinal: !state.isFinal });
    }
  };

  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  const nodeClasses = `
    relative w-12 h-12 rounded-full border-2 flex items-center justify-center
    text-sm font-medium cursor-pointer transition-all duration-200
    ${state.isInitial 
      ? 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
      : 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}
    ${state.isFinal ? 'shadow-lg' : ''}
    ${selected || isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-600' : ''}
    ${isAddingTransition ? 'hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700' : 'hover:shadow-md'}
  `;

  return (
    <>
      <div className="group" ref={nodeRef}>
        {/* Só mostrar Handle de entrada se não for estado inicial */}
        {!state.isInitial && (
          <Handle
            type="target"
            position={Position.Left}
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 z-10"
          />
        )}
        
        <div 
          className={nodeClasses} 
          onClick={handleClick}
          onContextMenu={handleRightClick}
        >
          {/* Estado inicial - apenas seta sem linha */}
          {state.isInitial && (
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-[16px] border-l-green-600 dark:border-l-green-500 border-t-[8px] border-b-[8px] border-t-transparent border-b-transparent"></div>
            </div>
          )}
          
          {/* Setas indicativas para transições */}
          {isAddingTransition && isSelected && (
            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 animate-pulse pointer-events-none">
              <div className="w-0 h-0 border-r-[12px] border-r-blue-500 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent"></div>
            </div>
          )}
          
          {isAddingTransition && selectedStateForTransition && selectedStateForTransition !== state.id && !isSelected && (
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 animate-pulse opacity-50 hover:opacity-100 pointer-events-none">
              <div className="w-0 h-0 border-l-[12px] border-l-orange-500 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent"></div>
            </div>
          )}
          
          {/* Estado final - círculo duplo */}
          {state.isFinal && (
            <div className="absolute inset-1 rounded-full border border-gray-400 dark:border-gray-500 pointer-events-none"></div>
          )}
          
          <span className="select-none">{state.label}</span>
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 z-10"
        />
      </div>

      {/* Menu de contexto usando portal */}
      <StateContextMenu 
        position={contextMenuPosition}
        isOpen={showContextMenu}
        onClose={closeContextMenu}
        onToggleInitial={toggleInitial}
        onToggleFinal={toggleFinal}
        onDelete={handleDelete}
        isInitial={state.isInitial}
        isFinal={state.isFinal}
      />
    </>
  );
};

export default memo(StateNode);