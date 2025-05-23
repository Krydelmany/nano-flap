import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  addNode as addAutomatonNodeAction,
  updateNodePosition as updateAutomatonNodePositionAction,
  setSelectedElements as setSelectedAutomatonElementsAction,
  addAutomatonEdge as addAutomatonEdgeAction,
  removeElements as removeAutomatonElementsAction,
} from '../../models/automatonSlice';

const CanvasArea = () => {
  const dispatch = useDispatch();
  const initialNodes = useSelector((state) => state.automaton.nodes);
  const initialEdges = useSelector((state) => state.automaton.edges);
  const uiTheme = useSelector((state) => state.ui.theme);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project, fitView, zoomIn, zoomOut } = useReactFlow();

  const [contextMenu, setContextMenu] = useState(null);
  
  // Estado para controlar o arrasto de transições com botão direito
  const [dragState, setDragState] = useState({
    isDragging: false,
    fromNodeId: null,
    mousePosition: { x: 0, y: 0 }
  });
  
  // Estado para o modal de símbolo quando criamos uma transição
  const [symbolModal, setSymbolModal] = useState({
    isOpen: false,
    fromNodeId: null,
    toNodeId: null,
    symbol: ''
  });

  useEffect(() => {
    console.log("CanvasArea DEBUG: initialNodes from Redux changed", JSON.stringify(initialNodes));
    setNodes(initialNodes.map(n => ({...n, data: {...n.data}})));
  }, [initialNodes, setNodes]);

  useEffect(() => {
    console.log("CanvasArea DEBUG: initialEdges from Redux changed", JSON.stringify(initialEdges));
    setEdges(initialEdges.map(e => ({...e, data: {...e.data}})));
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params) => {
      console.log("CanvasArea DEBUG: onConnect triggered with params:", JSON.stringify(params));
      const symbol = prompt('Digite o símbolo para a transição:');
      if (symbol) {
        const newEdge = { ...params, label: symbol, type: 'default', markerEnd: { type: 'arrowclosed' } };
        dispatch(addAutomatonEdgeAction(newEdge));
        console.log("CanvasArea DEBUG: onConnect dispatched addAutomatonEdgeAction with:", JSON.stringify(newEdge));
      }
    },
    [dispatch]
  );

  // Substitua o onNodeContextMenu atual por este código
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Exibe um prompt com opções para o estado
    const action = window.prompt(
      `Ações para o estado ${node.data.label || node.id}:\n` +
      `1. ${node.data.isInitial ? 'Remover' : 'Definir como'} estado inicial\n` +
      `2. ${node.data.isFinal ? 'Remover' : 'Definir como'} estado final\n` +
      `3. Excluir estado\n` +
      `Digite o número da ação:`
    );
    
    switch (action) {
      case '1':
        dispatch({ 
          type: 'automaton/updateState', 
          payload: {
            id: node.id,
            isInitial: !node.data.isInitial
          }
        });
        break;
      case '2':
        dispatch({ 
          type: 'automaton/updateState', 
          payload: {
            id: node.id,
            isFinal: !node.data.isFinal
          }
        });
        break;
      case '3':
        if (window.confirm(`Tem certeza que deseja excluir o estado ${node.data.label || node.id}?`)) {
          dispatch({
            type: 'automaton/removeState',
            payload: node.id
          });
        }
        break;
      default:
        break;
    }
  }, [dispatch]);

  // Acompanhar o movimento do mouse durante o arrasto
  const handleMouseMove = useCallback((event) => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        mousePosition: { x: event.clientX, y: event.clientY }
      }));
    }
  }, [dragState.isDragging]);
  
  // Finalizar o arrasto
  const handleMouseUp = useCallback((event) => {
    if (dragState.isDragging) {
      // Remover os event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Tentar encontrar o nó sob o cursor
      const targetNode = findNodeAtPosition(event.clientX, event.clientY);
      
      if (targetNode && targetNode.id !== dragState.fromNodeId) {
        // Abrir modal para obter o símbolo da transição
        setSymbolModal({
          isOpen: true,
          fromNodeId: dragState.fromNodeId,
          toNodeId: targetNode.id,
          symbol: ''
        });
        console.log("CanvasArea DEBUG: Ended drag on node:", targetNode.id);
      }
      
      // Resetar o estado de arrasto
      setDragState({
        isDragging: false,
        fromNodeId: null,
        mousePosition: { x: 0, y: 0 }
      });
    }
  }, [dragState.isDragging, dragState.fromNodeId]);
  
  // Função para encontrar um nó na posição do mouse
  const findNodeAtPosition = useCallback((x, y) => {
    // Este é um método simples, o ideal seria usar getBoundingClientRect() de cada nó
    // para uma detecção mais precisa, mas isto serve como demonstração
    return nodes.find(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      const nodeWidth = node.__rf?.width || 150; // Aproximado
      const nodeHeight = node.__rf?.height || 40; // Aproximado
      
      // Converte coordenadas do nó para coordenadas de tela
      const flowElement = document.querySelector('.react-flow');
      if (!flowElement) return false;
      const flowRect = flowElement.getBoundingClientRect();
      
      // Posição do nó em coordenadas de tela
      const screenX = flowRect.left + nodeX;
      const screenY = flowRect.top + nodeY;
      
      // Verifica se o mouse está sobre o nó
      return (
        x >= screenX &&
        x <= screenX + nodeWidth &&
        y >= screenY &&
        y <= screenY + nodeHeight
      );
    });
  }, [nodes]);
  
  // Lidar com a submissão do símbolo para a nova transição
  const handleSymbolSubmit = () => {
    if (symbolModal.symbol.trim()) {
      // Criar a conexão/transição
      const newEdge = {
        source: symbolModal.fromNodeId,
        target: symbolModal.toNodeId,
        label: symbolModal.symbol.trim(),
        type: 'default',
        markerEnd: { type: 'arrowclosed' }
      };
      
      dispatch(addAutomatonEdgeAction(newEdge));
      console.log("CanvasArea DEBUG: Created edge with:", JSON.stringify(newEdge));
    }
    
    // Fechar o modal
    setSymbolModal({
      isOpen: false,
      fromNodeId: null,
      toNodeId: null,
      symbol: ''
    });
  };

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      console.log("CanvasArea DEBUG: onNodesDelete called with", JSON.stringify(deletedNodes));
      dispatch(removeAutomatonElementsAction(deletedNodes));
    },
    [dispatch]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      console.log("CanvasArea DEBUG: onEdgesDelete called with", JSON.stringify(deletedEdges));
      dispatch(removeAutomatonElementsAction(deletedEdges));
    },
    [dispatch]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      console.log("CanvasArea DEBUG: onNodeDragStop called with node:", JSON.stringify(node));
      dispatch(updateAutomatonNodePositionAction({ id: node.id, position: node.position }));
    },
    [dispatch]
  );

  const handlePaneContextMenu = useCallback(
    (event) => {
      // Ignorar se estiver arrastando
      if (dragState.isDragging) {
        event.preventDefault();
        return;
      }
      
      event.preventDefault(); // Prevent native context menu
      console.log("CanvasArea DEBUG: ReactFlow onPaneContextMenu event triggered. Event object:", event);
      
      const position = project({
        x: event.clientX, 
        y: event.clientY,
      });
      console.log("CanvasArea DEBUG: Projected position for context menu:", JSON.stringify(position));

      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        projectedPosition: position, // Store the projected position for adding the node
      });
    },
    [project, setContextMenu, dragState.isDragging]
  );

  const handleCloseContextMenu = () => {
    console.log("CanvasArea DEBUG: Closing context menu.");
    setContextMenu(null);
  };

  const handleAddStateFromContextMenu = () => {
    if (contextMenu && contextMenu.projectedPosition) {
      console.log("CanvasArea DEBUG: Adding state from context menu at projected position:", JSON.stringify(contextMenu.projectedPosition));
      dispatch(addAutomatonNodeAction({ position: contextMenu.projectedPosition }));
    }
    handleCloseContextMenu();
  };

  useEffect(() => {
    const handleClickOutsideContextMenu = (event) => {
      if (contextMenu) {
         // A more specific check for clicking outside the menu element would be better here.
         // For now, let's assume onPaneClick handles clicks on the pane.
      }
    };
    document.addEventListener('click', handleClickOutsideContextMenu);
    return () => {
      document.removeEventListener('click', handleClickOutsideContextMenu);
    };
  }, [contextMenu]);
  
  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    const selected = [...selectedNodes, ...selectedEdges];
    console.log("CanvasArea DEBUG: onSelectionChange called with", JSON.stringify(selected));
    dispatch(setSelectedAutomatonElementsAction(selected));
  }, [dispatch]);

  const { fitViewCounter, zoomInCounter, zoomOutCounter } = useSelector((state) => state.canvas);
  useEffect(() => {
    if (fitViewCounter > 0 && fitView) {
        console.log("CanvasArea DEBUG: Executing fitView");
        fitView();
        dispatch({ type: 'canvas/resetFitViewCounter' }); 
    }
  }, [fitViewCounter, fitView, dispatch]);

  useEffect(() => {
    if (zoomInCounter > 0 && zoomIn) {
        console.log("CanvasArea DEBUG: Executing zoomIn");
        zoomIn();
        dispatch({ type: 'canvas/resetZoomInCounter' });
    }
  }, [zoomInCounter, zoomIn, dispatch]);

  useEffect(() => {
    if (zoomOutCounter > 0 && zoomOut) {
        console.log("CanvasArea DEBUG: Executing zoomOut");
        zoomOut();
        dispatch({ type: 'canvas/resetZoomOutCounter' });
    }
  }, [zoomOutCounter, zoomOut, dispatch]);

  useEffect(() => {
    // Impedir que o menu de contexto padrão apareça durante o arrasto
    const preventContextMenu = (e) => {
      if (dragState.isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    };
    
    document.addEventListener('contextmenu', preventContextMenu, { capture: true });
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu, { capture: true });
    };
  }, [dragState.isDragging]);

  return (
    <main 
      ref={reactFlowWrapper} 
      className="flex-1 overflow-hidden bg-gray-50 dark:bg-dark-900 relative automaton-canvas"
      style={{ pointerEvents: 'all' }} 
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}  // Garantir que este handler seja usado
        onPaneClick={handleCloseContextMenu}
        fitView
        attributionPosition="bottom-left"
        deleteKeyCode={'Delete'}
        style={{ width: '100%', height: '100%' }}
        // Desabilitar o menu de contexto nativo do ReactFlow
        onContextMenu={e => dragState.isDragging && e.preventDefault()}
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls showInteractive={false} /> 
        <Background color={uiTheme === 'dark' ? "#333" : "#ddd"} gap={16} />
        
        {nodes.length === 0 && !contextMenu && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-center p-4 rounded-lg bg-white/50 dark:bg-dark-700/50 pointer-events-none"
          >
            <p className="text-lg font-medium">Clique com o botão direito para criar um estado.</p>
            <p className="text-sm">Arraste de um estado para outro para criar uma transição.</p>
          </div>
        )}
        
        {/* Linha visual durante o arrasto com botão direito */}
        {dragState.isDragging && dragState.fromNodeId && (
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
            {nodes.map(node => {
              if (node.id === dragState.fromNodeId) {
                // Encontra a posição do nó de origem na tela
                const flowElement = document.querySelector('.react-flow');
                if (!flowElement) return null;
                const flowRect = flowElement.getBoundingClientRect();
                
                const nodeX = flowRect.left + node.position.x + (node.__rf?.width || 150) / 2;
                const nodeY = flowRect.top + node.position.y + (node.__rf?.height || 40) / 2;
                
                return (
                  <line
                    key="drag-line"
                    x1={nodeX}
                    y1={nodeY}
                    x2={dragState.mousePosition.x}
                    y2={dragState.mousePosition.y}
                    stroke="red"
                    strokeWidth="2"
                  />
                );
              }
              return null;
            })}
          </svg>
        )}
      </ReactFlow>
      
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            zIndex: 1000,
          }}
          className="bg-white dark:bg-dark-700 shadow-lg rounded-md py-1 border border-gray-200 dark:border-dark-600"
        >
          <button
            onClick={handleAddStateFromContextMenu}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
          >
            Adicionar Estado Aqui
          </button>
        </div>
      )}
      
      {/* Modal para inserir símbolo da transição */}
      {symbolModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Adicionar Transição</h3>
            <p className="mb-4">
              De {nodes.find(n => n.id === symbolModal.fromNodeId)?.data?.label || symbolModal.fromNodeId} para {nodes.find(n => n.id === symbolModal.toNodeId)?.data?.label || symbolModal.toNodeId}
            </p>
            <div className="mb-4">
              <label className="block mb-2">
                Símbolo:
                <input
                  type="text"
                  value={symbolModal.symbol}
                  onChange={e => setSymbolModal({...symbolModal, symbol: e.target.value})}
                  className="ml-2 border p-1 dark:bg-dark-800 dark:border-dark-500"
                  autoFocus
                  maxLength={1}
                />
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSymbolModal({isOpen: false, fromNodeId: null, toNodeId: null, symbol: ''})}
                className="px-4 py-2 bg-gray-200 dark:bg-dark-600 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSymbolSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CanvasArea;

