import React, { useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  addState, 
  updateState, 
  removeState, 
  addTransition, 
  removeTransition 
} from '../../models/automatonSlice';

// Componentes personalizados para os nós
const StateNode = ({ data, isConnectable, id }) => {
  return (
    <div 
      className={`node ${data.isInitial ? 'node-initial' : ''} ${data.isFinal ? 'node-final' : ''}`}
      data-nodeid={id} // Adicionando atributo para identificação
    >
      {data.label}
    </div>
  );
};

const nodeTypes = {
  state: StateNode,
};

const AutomatonCanvas = () => {
  const dispatch = useDispatch();
  const { states, transitions, type } = useSelector((state) => state.automaton);
  const reactFlowWrapper = useRef(null);
  
  // Estado para controlar o arrasto de transições
  const [dragState, setDragState] = useState({
    isDragging: false,
    fromNodeId: null,
    mousePosition: { x: 0, y: 0 }
  });
  
  // Estado para controlar o modal de contexto
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    node: null,
    position: { x: 0, y: 0 }
  });
  
  // Converter estados e transições para o formato do ReactFlow
  const initialNodes = Object.values(states).map(state => ({
    id: state.id,
    type: 'state',
    position: { x: state.x, y: state.y },
    data: { 
      label: state.label,
      isInitial: state.isInitial,
      isFinal: state.isFinal,
    },
  }));
  
  const initialEdges = Object.values(transitions).map(transition => ({
    id: transition.id,
    source: transition.from,
    target: transition.to,
    label: transition.symbol,
    type: 'default',
    animated: transition.symbol === 'ε',
    style: { stroke: '#888' },
    labelStyle: { fill: '#888', fontWeight: 500 },
    labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' },
  }));
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Atualizar nós e arestas quando os estados e transições mudarem
  React.useEffect(() => {
    const updatedNodes = Object.values(states).map(state => ({
      id: state.id,
      type: 'state',
      position: { x: state.x, y: state.y },
      data: { 
        label: state.label,
        isInitial: state.isInitial,
        isFinal: state.isFinal,
      },
    }));
    
    const updatedEdges = Object.values(transitions).map(transition => ({
      id: transition.id,
      source: transition.from,
      target: transition.to,
      label: transition.symbol,
      type: 'default',
      animated: transition.symbol === 'ε',
      style: { stroke: '#888' },
      labelStyle: { fill: '#888', fontWeight: 500 },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.75)' },
    }));
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [states, transitions, setNodes, setEdges]);
  
  // Adicionar event listeners para mouse
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragState.isDragging) {
        setDragState(prev => ({
          ...prev,
          mousePosition: { x: event.clientX, y: event.clientY }
        }));
      }
    };

    const handleMouseUp = (event) => {
      if (dragState.isDragging) {
        // Encontrar o elemento sob o cursor
        const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
        // Usar o seletor correto para encontrar o nó
        const nodeElement = elementUnderMouse?.closest('[data-nodeid]');
        
        if (nodeElement) {
          const targetNodeId = nodeElement.getAttribute('data-nodeid');
          if (targetNodeId && targetNodeId !== dragState.fromNodeId) {
            // Criar transição
            const symbol = prompt('Digite o símbolo para esta transição:');
            if (symbol) {
              dispatch(addTransition({
                from: dragState.fromNodeId,
                to: targetNodeId,
                symbol,
              }));
            }
          }
        }
        
        // Resetar estado
        setDragState({
          isDragging: false,
          fromNodeId: null,
          mousePosition: { x: 0, y: 0 }
        });
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [dragState.isDragging, dragState.fromNodeId, dispatch]);

  // Manipuladores de eventos
  const onConnect = useCallback((params) => {
    // Abrir um prompt para o símbolo da transição
    const symbol = prompt('Digite o símbolo para esta transição:');
    if (symbol) {
      dispatch(addTransition({
        from: params.source,
        to: params.target,
        symbol,
      }));
    }
  }, [dispatch]);
  
  const onNodeDragStop = useCallback((event, node) => {
    dispatch(updateState({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
    }));
  }, [dispatch]);
  
  const onPaneClick = useCallback((event) => {
    // Adicionar um novo estado ao clicar no painel
    if (event.target === event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      
      // Verificar se é o primeiro estado (será o inicial)
      const isInitial = Object.keys(states).length === 0;
      
      dispatch(addState({
        x: position.x,
        y: position.y,
        isInitial,
        isFinal: false,
      }));
    }
  }, [dispatch, states]);
  
  // Manipulador específico para clique do mouse - detecta botão direito
  const onNodeMouseDown = useCallback((event, node) => {
    if (event.button === 2) { // Botão direito do mouse
      event.preventDefault();
      event.stopPropagation();
      
      setDragState({
        isDragging: true,
        fromNodeId: node.id,
        mousePosition: { x: event.clientX, y: event.clientY }
      });
      return;
    }
  }, []);
  
  // Modificar o onNodeContextMenu para abrir o modal em vez do prompt
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    
    // Só mostrar menu de contexto se não estiver arrastando
    if (dragState.isDragging) {
      return;
    }
    
    // Abrir o modal de contexto
    setContextMenu({
      isOpen: true,
      node: node,
      position: { x: event.clientX, y: event.clientY }
    });
  }, [dragState.isDragging]);
  
  // Funções para o modal de contexto
  const handleSetInitial = useCallback(() => {
    if (contextMenu.node) {
      dispatch(updateState({
        id: contextMenu.node.id,
        isInitial: !contextMenu.node.data.isInitial,
      }));
      setContextMenu({ isOpen: false, node: null, position: { x: 0, y: 0 } });
    }
  }, [contextMenu.node, dispatch]);
  
  const handleSetFinal = useCallback(() => {
    if (contextMenu.node) {
      dispatch(updateState({
        id: contextMenu.node.id,
        isFinal: !contextMenu.node.data.isFinal,
      }));
      setContextMenu({ isOpen: false, node: null, position: { x: 0, y: 0 } });
    }
  }, [contextMenu.node, dispatch]);
  
  const handleDeleteState = useCallback(() => {
    if (contextMenu.node) {
      if (window.confirm(`Tem certeza que deseja excluir o estado ${contextMenu.node.data.label}?`)) {
        dispatch(removeState(contextMenu.node.id));
      }
      setContextMenu({ isOpen: false, node: null, position: { x: 0, y: 0 } });
    }
  }, [contextMenu.node, dispatch]);
  
  const closeContextMenu = useCallback(() => {
    setContextMenu({ isOpen: false, node: null, position: { x: 0, y: 0 } });
  }, []);
  
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    
    if (window.confirm(`Deseja remover esta transição?`)) {
      dispatch(removeTransition(edge.id));
    }
  }, [dispatch]);
  
  return (
    <div 
      className="h-full border border-gray-300 rounded-md overflow-hidden dark:border-dark-600 automaton-canvas"
      ref={reactFlowWrapper}
      onClick={closeContextMenu}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onNodeMouseDown={onNodeMouseDown} // Adicionando handler para detectar botão direito
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        
        {/* Linha visual durante o arrasto */}
        {dragState.isDragging && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            {(() => {
              const fromNode = nodes.find(n => n.id === dragState.fromNodeId);
              if (fromNode) {
                return (
                  <line
                    x1={fromNode.position.x + 37.5} // Centro aproximado do nó
                    y1={fromNode.position.y + 37.5} // Centro aproximado do nó
                    x2={dragState.mousePosition.x}
                    y2={dragState.mousePosition.y}
                    stroke="red"
                    strokeWidth="2"
                    strokeDasharray="5,5" // Linha tracejada
                  />
                );
              }
              return null;
            })()}
          </svg>
        )}
      </ReactFlow>
      
      {/* Modal de contexto para o nó */}
      {contextMenu.isOpen && contextMenu.node && (
        <div 
          className="fixed z-50 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-md shadow-lg"
          style={{ 
            top: contextMenu.position.y, 
            left: contextMenu.position.x,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 py-2 font-bold border-b border-gray-200 dark:border-dark-600 text-gray-800 dark:text-gray-200">
            Estado {contextMenu.node.data.label}
          </div>
          <button 
            className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
            onClick={handleSetInitial}
          >
            {contextMenu.node.data.isInitial ? 'Remover estado inicial' : 'Definir como estado inicial'}
          </button>
          <button 
            className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
            onClick={handleSetFinal}
          >
            {contextMenu.node.data.isFinal ? 'Remover estado final' : 'Definir como estado final'}
          </button>
          <button 
            className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleDeleteState}
          >
            Excluir estado
          </button>
        </div>
      )}
    </div>
  );
};

// Wrapper com ReactFlowProvider para garantir acesso aos hooks do ReactFlow
const AutomatonCanvasWrapper = () => {
  return (
    <ReactFlowProvider>
      <AutomatonCanvas />
    </ReactFlowProvider>
  );
};

export default AutomatonCanvasWrapper;
