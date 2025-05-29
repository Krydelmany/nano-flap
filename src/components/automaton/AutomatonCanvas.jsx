import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/reactflow-dark.css';

import StateNode from './StateNode';
import {
  addStateToActiveAutomaton,
  addTransition,
  removeState,
  removeTransition,
  updateState,
} from '../../models/automatonSlice';
import TransitionSymbolModal from './TransitionSymbolModal';
import ConfirmModal from '../common/ConfirmModal';

const nodeTypes = {
  stateNode: StateNode,
};

const AutomatonCanvas = () => {
  const dispatch = useDispatch();
  const { states, transitions, alphabet } = useSelector((state) => state.automaton);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAddingState, setIsAddingState] = useState(false);
  const [isAddingTransition, setIsAddingTransition] = useState(false);
  const [selectedStateForTransition, setSelectedStateForTransition] = useState(null);

  // Estado para controlar o modal de transição
  const [transitionModal, setTransitionModal] = useState({
    isOpen: false,
    sourceId: null,
    targetId: null
  });
  
  // Estado para modal de confirmação
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Manipular mudanças de posição dos nós
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    
    // Atualizar posições no Redux
    const positionChanges = changes.filter(change => change.type === 'position');
    if (positionChanges.length > 0) {
      positionChanges.forEach(change => {
        if (change.position) {
          dispatch(updateState({
            id: change.id,
            x: change.position.x,
            y: change.position.y,
          }));
        }
      });
    }
  }, [onNodesChange, dispatch]);

  // Manipular clique no canvas para adicionar estado
  const handlePaneClick = useCallback((event) => {
    if (isAddingState) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 25, // Centralizar o nó
        y: event.clientY - bounds.top - 25,
      };
      
      dispatch(addStateToActiveAutomaton({
        x: position.x,
        y: position.y,
        isInitial: Object.keys(states).length === 0, // Primeiro estado é inicial
        isFinal: false,
      }));
      
      setIsAddingState(false);
    } else if (isAddingTransition) {
      // Cancelar modo de adição de transição se clicar no canvas vazio
      setIsAddingTransition(false);
      setSelectedStateForTransition(null);
    }
  }, [isAddingState, isAddingTransition, states, dispatch]);

  // Manipular clique em estado
  const handleStateClick = useCallback((stateId) => {
    if (isAddingTransition) {
      if (!selectedStateForTransition) {
        // Primeiro estado selecionado
        setSelectedStateForTransition(stateId);
      } else if (selectedStateForTransition !== stateId) {
        // Segundo estado selecionado - abrir modal para símbolo
        setTransitionModal({
          isOpen: true,
          sourceId: selectedStateForTransition,
          targetId: stateId
        });
      }
    }
  }, [isAddingTransition, selectedStateForTransition]);

  // Manipular exclusão de estado
  const handleStateDelete = useCallback((stateId) => {
    const state = states[stateId];
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Excluir Estado',
      message: `Tem certeza que deseja excluir o estado "${state?.label}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        dispatch(removeState(stateId));
      }
    });
  }, [dispatch, states]);

  // Manipular atualização de estado
  const handleStateUpdate = useCallback((stateId, updates) => {
    dispatch(updateState({ id: stateId, ...updates }));
  }, [dispatch]);

  // Converter estados Redux para nós ReactFlow
  useEffect(() => {
    const nodeList = Object.values(states).map(state => ({
      id: state.id,
      type: 'stateNode',
      position: { x: state.x, y: state.y },
      data: { 
        state,
        onStateClick: handleStateClick,
        onStateDelete: handleStateDelete,
        onStateUpdate: handleStateUpdate,
        isSelected: selectedStateForTransition === state.id,
        isAddingTransition,
        selectedStateForTransition,
      },
    }));
    setNodes(nodeList);
  }, [states, selectedStateForTransition, isAddingTransition, setNodes, handleStateClick, handleStateDelete, handleStateUpdate]);

  // Converter transições Redux para arestas ReactFlow
  useEffect(() => {
    const edgeList = Object.values(transitions).map(transition => ({
      id: transition.id,
      source: transition.from,
      target: transition.to,
      label: transition.symbol,
      type: 'default',
      animated: false,
      style: { 
        stroke: '#888', 
        strokeWidth: 2,
        strokeDasharray: '0',
      },
      labelStyle: { fill: '#000', fontWeight: 600 },
      labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
      markerEnd: {
        type: 'arrow',
        color: '#888',
        width: 15,
        height: 20,
      },
      data: { transition },
    }));
    setEdges(edgeList);
  }, [transitions, setEdges]);

  // Função para adicionar a transição após confirmar no modal
  const handleAddTransition = useCallback((symbol) => {
    if (symbol && alphabet.includes(symbol)) {
      dispatch(addTransition({
        from: transitionModal.sourceId,
        to: transitionModal.targetId,
        symbol: symbol,
      }));
      
      setIsAddingTransition(false);
      setSelectedStateForTransition(null);
    }
  }, [dispatch, alphabet, transitionModal, setIsAddingTransition, setSelectedStateForTransition]);

  // Fechar modal sem adicionar transição
  const handleCloseModal = useCallback(() => {
    setTransitionModal({
      isOpen: false,
      sourceId: null,
      targetId: null
    });
    
    setIsAddingTransition(false);
    setSelectedStateForTransition(null);
  }, [setIsAddingTransition, setSelectedStateForTransition]);

  // Manipular conexão de arestas (para criar transições)
  const onConnect = useCallback((params) => {
    setTransitionModal({
      isOpen: true,
      sourceId: params.source,
      targetId: params.target
    });
  }, []);

  // Manipular clique em aresta para remover
  const handleEdgeClick = useCallback((event, edge) => {
    const transition = edge.data.transition;
    setConfirmModal({
      isOpen: true,
      type: 'warning',
      title: 'Excluir Transição',
      message: `Tem certeza que deseja excluir a transição "${transition.symbol}" entre os estados?`,
      onConfirm: () => {
        dispatch(removeTransition(edge.id));
      }
    });
  }, [dispatch]);

  // Fechar modal de confirmação
  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      type: 'danger',
      title: '',
      message: '',
      onConfirm: () => {}
    });
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        className={isAddingState ? 'cursor-crosshair' : ''}
      >
        <Background />
        <Controls />
        <MiniMap />
        
        <Panel position="top-left" className="space-x-2">
          <button
            onClick={() => {
              setIsAddingState(!isAddingState);
              setIsAddingTransition(false);
              setSelectedStateForTransition(null);
            }}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isAddingState
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isAddingState ? 'Cancelar' : 'Adicionar Estado'}
          </button>
          
          <button
            onClick={() => {
              setIsAddingTransition(!isAddingTransition);
              setIsAddingState(false);
              setSelectedStateForTransition(null);
            }}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isAddingTransition
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isAddingTransition ? 'Cancelar' : 'Adicionar Transição'}
          </button>
        </Panel>
        
        {isAddingState && (
          <Panel position="top-center">
            <div className="bg-blue-100 border border-blue-300 rounded-md px-3 py-2 text-sm text-blue-800">
              Clique no canvas para adicionar um estado
            </div>
          </Panel>
        )}
        
        {isAddingTransition && (
          <Panel position="top-center">
            <div className="bg-green-100 border border-green-300 rounded-md px-3 py-2 text-sm text-green-800">
              {!selectedStateForTransition 
                ? 'Clique no estado de origem'
                : 'Clique no estado de destino'
              }
            </div>
          </Panel>
        )}
      </ReactFlow>
      
      {/* Modal para adicionar símbolo de transição */}
      <TransitionSymbolModal
        isOpen={transitionModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleAddTransition}
        availableSymbols={alphabet}
        sourceState={transitionModal.sourceId ? states[transitionModal.sourceId]?.label : ''}
        targetState={transitionModal.targetId ? states[transitionModal.targetId]?.label : ''}
      />

      {/* Modal de confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default AutomatonCanvas;
