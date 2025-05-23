import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransition } from '../models/automatonSlice';

const AutomatonCanvas = () => {
  const dispatch = useDispatch();
  const states = useSelector(state => state.automaton.states);
  const transitions = useSelector(state => state.automaton.transitions);
  const canvasRef = useRef(null);

  // Estado para controlar o arrastar de transições
  const [dragState, setDragState] = useState({
    isDragging: false,
    fromStateId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  // Estado para o modal de símbolo
  const [symbolModal, setSymbolModal] = useState({
    isOpen: false,
    fromStateId: null,
    toStateId: null,
    symbol: ''
  });

  // Detectar estado sob o cursor
  const getStateAtPosition = (x, y) => {
    const stateRadius = 30; // Raio dos círculos que representam estados
    
    return Object.values(states).find(state => {
      const distance = Math.sqrt(
        Math.pow(state.x - x, 2) + Math.pow(state.y - y, 2)
      );
      return distance <= stateRadius;
    });
  };

  // Iniciar o arrasto de transição (botão direito)
  const handleMouseDown = (e) => {
    if (e.button === 2) { // Botão direito do mouse
      e.preventDefault(); // Prevenir menu de contexto
      e.stopPropagation(); // Impedir propagação do evento
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const sourceState = getStateAtPosition(x, y);
      
      if (sourceState) {
        // Marcar que estamos no modo de criação de transição
        setDragState({
          isDragging: true,
          fromStateId: sourceState.id,
          startX: sourceState.x,
          startY: sourceState.y,
          currentX: x,
          currentY: y
        });
      }
    }
  };

  // Atualizar posição durante o arrasto
  const handleMouseMove = (e) => {
    if (dragState.isDragging) {
      e.preventDefault(); // Prevenir comportamentos padrão
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setDragState(prev => ({
        ...prev,
        currentX: x,
        currentY: y
      }));
    }
  };

  // Finalizar o arrasto e verificar se terminou sobre outro estado
  const handleMouseUp = (e) => {
    if (dragState.isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const targetState = getStateAtPosition(x, y);
      
      if (targetState && targetState.id !== dragState.fromStateId) {
        // Abrir modal para obter o símbolo da transição
        setSymbolModal({
          isOpen: true,
          fromStateId: dragState.fromStateId,
          toStateId: targetState.id,
          symbol: ''
        });
      }
      
      // Resetar o estado de arrastar
      setDragState({
        isDragging: false,
        fromStateId: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
      });
    }
  };

  // Lidar com a submissão do símbolo
  const handleSymbolSubmit = () => {
    if (symbolModal.symbol.trim()) {
      // Despachar ação para criar a transição
      dispatch(addTransition({
        from: symbolModal.fromStateId,
        to: symbolModal.toStateId,
        symbol: symbolModal.symbol.trim()
      }));
    }
    
    // Fechar o modal
    setSymbolModal({
      isOpen: false,
      fromStateId: null,
      toStateId: null,
      symbol: ''
    });
  };

  // Adicionar handler para click direito nos estados
  const handleStateContextMenu = (e, stateId) => {
    // Só mostrar menu se não estivermos arrastando
    if (!dragState.isDragging) {
      e.preventDefault();
      const state = states[stateId];
      
      // Menu de contexto para o nó
      const action = window.prompt(
        `Ações para o estado ${state.label}:\n` +
        `1. ${state.isInitial ? 'Remover' : 'Definir como'} estado inicial\n` +
        `2. ${state.isFinal ? 'Remover' : 'Definir como'} estado final\n` +
        `3. Excluir estado\n` +
        `Digite o número da ação:`
      );
      
      // ...código de tratamento do menu...
    }
  };

  // Renderizar os estados e transições
  const renderAutomaton = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const stateRadius = 30;
    
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar as transições
    Object.values(transitions).forEach(transition => {
      const fromState = states[transition.from];
      const toState = states[transition.to];
      
      if (fromState && toState) {
        drawTransition(ctx, fromState, toState, transition.symbol);
      }
    });
    
    // Desenhar os estados
    Object.values(states).forEach(state => {
      drawState(ctx, state, stateRadius);
      
      // Adicionar área de clique invisível para cada estado
      const stateArea = document.createElement('div');
      stateArea.style.position = 'absolute';
      stateArea.style.left = `${state.x - stateRadius}px`;
      stateArea.style.top = `${state.y - stateRadius}px`;
      stateArea.style.width = `${stateRadius * 2}px`;
      stateArea.style.height = `${stateRadius * 2}px`;
      stateArea.style.borderRadius = '50%';
      stateArea.style.zIndex = '1000';
      
      // Adicionar evento de contexto apenas quando não estamos arrastando
      stateArea.oncontextmenu = (e) => handleStateContextMenu(e, state.id);
    });
  };

  // Desenhar um estado
  const drawState = (ctx, state, radius) => {
    // Estado
    ctx.beginPath();
    ctx.arc(state.x, state.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = state.isInitial ? '#a3e4d7' : (state.isFinal ? '#f5b7b1' : '#white');
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Rótulo
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.label, state.x, state.y);
    
    // Marca de estado inicial
    if (state.isInitial) {
      ctx.beginPath();
      ctx.moveTo(state.x - radius - 15, state.y);
      ctx.lineTo(state.x - radius, state.y);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Desenhar seta
      ctx.beginPath();
      ctx.moveTo(state.x - radius - 5, state.y - 5);
      ctx.lineTo(state.x - radius, state.y);
      ctx.lineTo(state.x - radius - 5, state.y + 5);
      ctx.stroke();
    }
    
    // Marca de estado final (círculo duplo)
    if (state.isFinal) {
      ctx.beginPath();
      ctx.arc(state.x, state.y, radius - 5, 0, 2 * Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Desenhar uma transição
  const drawTransition = (ctx, fromState, toState, symbol) => {
    // Calcular a direção da transição
    const dx = toState.x - fromState.x;
    const dy = toState.y - fromState.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Se auto-transição (loop)
    if (fromState.id === toState.id) {
      drawSelfTransition(ctx, fromState, symbol);
      return;
    }
    
    // Pontos de controle para uma curva suave
    const stateRadius = 30;
    const normalX = -dy / distance;
    const normalY = dx / distance;
    const controlPointDist = distance / 4;
    
    const cp1x = fromState.x + normalX * controlPointDist;
    const cp1y = fromState.y + normalY * controlPointDist;
    const cp2x = toState.x + normalX * controlPointDist;
    const cp2y = toState.y + normalY * controlPointDist;
    
    // Calcular pontos de início e fim (na borda dos círculos)
    const startX = fromState.x + (dx / distance) * stateRadius;
    const startY = fromState.y + (dy / distance) * stateRadius;
    const endX = toState.x - (dx / distance) * stateRadius;
    const endY = toState.y - (dy / distance) * stateRadius;
    
    // Desenhar a linha curva
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Desenhar a ponta da seta
    const arrowLength = 10;
    const arrowAngle = Math.atan2(endY - cp2y, endX - cp2x);
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(arrowAngle - Math.PI / 6),
      endY - arrowLength * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - arrowLength * Math.cos(arrowAngle + Math.PI / 6),
      endY - arrowLength * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = '#555';
    ctx.fill();
    
    // Desenhar o símbolo
    const textX = (startX + endX) / 2 + normalX * 15;
    const textY = (startY + endY) / 2 + normalY * 15;
    
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, textX, textY);
  };

  // Desenhar uma auto-transição (loop)
  const drawSelfTransition = (ctx, state, symbol) => {
    const radius = 30;
    const loopRadius = 20;
    
    // Desenhar o loop acima do estado
    ctx.beginPath();
    ctx.arc(state.x, state.y - radius, loopRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Desenhar a ponta da seta
    const arrowAngle = Math.PI / 4;
    const arrowX = state.x + loopRadius * Math.cos(arrowAngle);
    const arrowY = state.y - radius - loopRadius * Math.sin(arrowAngle);
    const arrowLength = 10;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(arrowAngle - Math.PI / 6),
      arrowY + arrowLength * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowX - arrowLength * Math.cos(arrowAngle + Math.PI / 6),
      arrowY + arrowLength * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = '#555';
    ctx.fill();
    
    // Desenhar o símbolo
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, state.x, state.y - radius - loopRadius * 2);
  };

  // Usar renderização quando os estados ou transições mudarem
  useEffect(() => {
    renderAutomaton();
  }, [states, transitions, dragState]);

  // Prevenir menu de contexto padrão no canvas
  const preventContextMenu = (e) => {
    // Verificar se o clique foi diretamente no canvas, não em um estado
    const clickedState = getStateAtPosition(e.offsetX, e.offsetY);
    if (!clickedState) {
      e.preventDefault();
    }
  };

  // Configurar event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.addEventListener('contextmenu', preventContextMenu);
      
      return () => {
        canvas.removeEventListener('contextmenu', preventContextMenu);
      };
    }
  }, []);

  return (
    <div className="automaton-canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={preventContextMenu}
        className="automaton-canvas"
      />
      
      {/* Modal para inserir símbolo da transição */}
      {symbolModal.isOpen && (
        <div className="transition-symbol-modal">
          <div className="modal-content">
            <h3>Adicionar Transição</h3>
            <p>
              De {states[symbolModal.fromStateId]?.label} para {states[symbolModal.toStateId]?.label}
            </p>
            <label>
              Símbolo:
              <input
                type="text"
                value={symbolModal.symbol}
                onChange={e => setSymbolModal({...symbolModal, symbol: e.target.value})}
                autoFocus
                maxLength={1}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleSymbolSubmit}>Adicionar</button>
              <button onClick={() => setSymbolModal({isOpen: false, fromStateId: null, toStateId: null, symbol: ''})}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatonCanvas;