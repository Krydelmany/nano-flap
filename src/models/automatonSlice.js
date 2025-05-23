import { createSlice } from '@reduxjs/toolkit';

// Definição das classes de autômatos
class State {
  constructor(id, label, x, y, isInitial = false, isFinal = false) {
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.isInitial = isInitial;
    this.isFinal = isFinal;
  }
}

class Transition {
  constructor(from, to, symbol) {
    this.id = `${from}-${symbol}-${to}`;
    this.from = from;
    this.to = to;
    this.symbol = symbol;
  }
}

// Estado inicial do Redux
const initialState = {
  automatons: [], // lista de autômatos
  selectedAutomata: [], // ids dos autômatos selecionados para composição
  activeAutomatonId: null,
  type: 'dfa', // 'dfa' ou 'nfa'
  alphabet: [],
  states: {},
  transitions: {},
  currentStateId: 0,
  simulationInput: '',
  simulationResult: null, // null, 'accepted', 'rejected'
  simulationSteps: [],
  currentSimulationStep: -1,
  simulationActive: false,
  error: null,
};

function generateUniqueId() {
  return '_' + Math.random().toString(36).substring(2, 9);
}

function unionAutomata(a1, a2) {
  // Criar um novo autômato que aceita cadeias aceitas por a1 OU a2
  const newId = generateUniqueId();
  const newAutomaton = {
    id: newId,
    name: `União de ${a1.name || a1.id} e ${a2.name || a2.id}`,
    type: 'nfa', // União sempre resulta em um AFN
    alphabet: [...new Set([...a1.alphabet, ...a2.alphabet])],
    states: {},
    transitions: {},
    currentStateId: 0,
  };
  
  // Mapear IDs antigos para novos para evitar conflitos
  const stateMap1 = {};
  const stateMap2 = {};
  
  // Copiar estados de a1 com prefixo para evitar colisões
  Object.values(a1.states).forEach(state => {
    const newStateId = `q${newAutomaton.currentStateId++}`;
    stateMap1[state.id] = newStateId;
    newAutomaton.states[newStateId] = {
      ...state,
      id: newStateId,
      label: newStateId,
      isInitial: false, // Vamos criar um novo estado inicial
      x: state.x + 100, // Deslocamento para visualização
      y: state.y,
    };
  });
  
  // Copiar estados de a2 com prefixo
  Object.values(a2.states).forEach(state => {
    const newStateId = `q${newAutomaton.currentStateId++}`;
    stateMap2[state.id] = newStateId;
    newAutomaton.states[newStateId] = {
      ...state,
      id: newStateId,
      label: newStateId,
      isInitial: false, // Vamos criar um novo estado inicial
      x: state.x - 100, // Deslocamento para visualização
      y: state.y + 100,
    };
  });
  
  // Criar um novo estado inicial
  const newInitialStateId = `q${newAutomaton.currentStateId++}`;
  newAutomaton.states[newInitialStateId] = {
    id: newInitialStateId,
    label: newInitialStateId,
    x: 0, // Centro
    y: 0,
    isInitial: true,
    isFinal: false,
  };
  
  // Copiar transições de a1
  Object.values(a1.transitions).forEach(transition => {
    const newFrom = stateMap1[transition.from];
    const newTo = stateMap1[transition.to];
    const newTransitionId = `${newFrom}-${transition.symbol}-${newTo}`;
    
    newAutomaton.transitions[newTransitionId] = {
      id: newTransitionId,
      from: newFrom,
      to: newTo,
      symbol: transition.symbol,
    };
  });
  
  // Copiar transições de a2
  Object.values(a2.transitions).forEach(transition => {
    const newFrom = stateMap2[transition.from];
    const newTo = stateMap2[transition.to];
    const newTransitionId = `${newFrom}-${transition.symbol}-${newTo}`;
    
    newAutomaton.transitions[newTransitionId] = {
      id: newTransitionId,
      from: newFrom,
      to: newTo,
      symbol: transition.symbol,
    };
  });
  
  // Adicionar ε ao alfabeto se não existir
  if (!newAutomaton.alphabet.includes('ε')) {
    newAutomaton.alphabet.push('ε');
  }
  
  // Encontrar estados iniciais originais
  const initialState1 = Object.values(a1.states).find(s => s.isInitial);
  const initialState2 = Object.values(a2.states).find(s => s.isInitial);
  
  if (initialState1) {
    // Adicionar ε-transição do novo estado inicial para o estado inicial de a1
    const newTransitionId1 = `${newInitialStateId}-ε-${stateMap1[initialState1.id]}`;
    newAutomaton.transitions[newTransitionId1] = {
      id: newTransitionId1,
      from: newInitialStateId,
      to: stateMap1[initialState1.id],
      symbol: 'ε',
    };
  }
  
  if (initialState2) {
    // Adicionar ε-transição do novo estado inicial para o estado inicial de a2
    const newTransitionId2 = `${newInitialStateId}-ε-${stateMap2[initialState2.id]}`;
    newAutomaton.transitions[newTransitionId2] = {
      id: newTransitionId2,
      from: newInitialStateId,
      to: stateMap2[initialState2.id],
      symbol: 'ε',
    };
  }
  
  return newAutomaton;
}

function concatAutomata(a1, a2) {
  // Criar um novo autômato que aceita cadeias w1w2 onde w1 é aceita por a1 e w2 por a2
  const newId = generateUniqueId();
  const newAutomaton = {
    id: newId,
    name: `Concatenação de ${a1.name || a1.id} e ${a2.name || a2.id}`,
    type: 'nfa', // Concatenação sempre resulta em um AFN
    alphabet: [...new Set([...a1.alphabet, ...a2.alphabet])],
    states: {},
    transitions: {},
    currentStateId: 0,
  };
  
  // Mapear IDs antigos para novos
  const stateMap1 = {};
  const stateMap2 = {};
  
  // Copiar estados de a1
  Object.values(a1.states).forEach(state => {
    const newStateId = `q${newAutomaton.currentStateId++}`;
    stateMap1[state.id] = newStateId;
    newAutomaton.states[newStateId] = {
      ...state,
      id: newStateId,
      label: newStateId,
      x: state.x,
      y: state.y,
      // Manter o estado inicial apenas se for de a1
      isInitial: state.isInitial,
      // Remover flag de estado final, vamos usar os estados finais de a2
      isFinal: false,
    };
  });
  
  // Copiar estados de a2
  Object.values(a2.states).forEach(state => {
    const newStateId = `q${newAutomaton.currentStateId++}`;
    stateMap2[state.id] = newStateId;
    newAutomaton.states[newStateId] = {
      ...state,
      id: newStateId,
      label: newStateId,
      x: state.x + 300, // Deslocamento para visualização
      y: state.y,
      // Nunca será inicial no autômato composto
      isInitial: false,
      // Manter estados finais de a2
      isFinal: state.isFinal,
    };
  });
  
  // Copiar transições de a1
  Object.values(a1.transitions).forEach(transition => {
    const newFrom = stateMap1[transition.from];
    const newTo = stateMap1[transition.to];
    const newTransitionId = `${newFrom}-${transition.symbol}-${newTo}`;
    
    newAutomaton.transitions[newTransitionId] = {
      id: newTransitionId,
      from: newFrom,
      to: newTo,
      symbol: transition.symbol,
    };
  });
  
  // Copiar transições de a2
  Object.values(a2.transitions).forEach(transition => {
    const newFrom = stateMap2[transition.from];
    const newTo = stateMap2[transition.to];
    const newTransitionId = `${newFrom}-${transition.symbol}-${newTo}`;
    
    newAutomaton.transitions[newTransitionId] = {
      id: newTransitionId,
      from: newFrom,
      to: newTo,
      symbol: transition.symbol,
    };
  });
  
  // Adicionar ε ao alfabeto se não existir
  if (!newAutomaton.alphabet.includes('ε')) {
    newAutomaton.alphabet.push('ε');
  }
  
  // Encontrar estado inicial de a2
  const initialState2 = Object.values(a2.states).find(s => s.isInitial);
  if (!initialState2) return newAutomaton; // Não pode concatenar sem estado inicial em a2
  
  // Adicionar ε-transições dos estados finais de a1 para o estado inicial de a2
  Object.values(a1.states).forEach(state => {
    if (state.isFinal) {
      const newFrom = stateMap1[state.id];
      const newTo = stateMap2[initialState2.id];
      const newTransitionId = `${newFrom}-ε-${newTo}`;
      
      newAutomaton.transitions[newTransitionId] = {
        id: newTransitionId,
        from: newFrom,
        to: newTo,
        symbol: 'ε',
      };
    }
  });
  
  return newAutomaton;
}

function intersectAutomata(a1, a2) {
  // Produto cartesiano de estados: cada estado do novo autômato é um par (q1,q2)
  const newId = generateUniqueId();
  const newAutomaton = {
    id: newId,
    name: `Interseção de ${a1.name || a1.id} e ${a2.name || a2.id}`,
    type: 'dfa', // Interseção de AFDs resulta em um AFD
    alphabet: a1.alphabet.filter(symbol => a2.alphabet.includes(symbol)), // Interseção dos alfabetos
    states: {},
    transitions: {},
    currentStateId: 0,
  };
  
  // Se os alfabetos não têm interseção, retorna um autômato vazio
  if (newAutomaton.alphabet.length === 0) {
    const emptyStateId = `q${newAutomaton.currentStateId++}`;
    newAutomaton.states[emptyStateId] = {
      id: emptyStateId,
      label: emptyStateId,
      x: 0,
      y: 0,
      isInitial: true,
      isFinal: false, // Sem estados finais, não aceita nada
    };
    return newAutomaton;
  }
  
  // Mapear pares de estados para novos estados
  const stateMap = {};
  const states1 = Object.values(a1.states);
  const states2 = Object.values(a2.states);
  
  // Encontrar os estados iniciais
  const initialState1 = states1.find(s => s.isInitial);
  const initialState2 = states2.find(s => s.isInitial);
  
  if (!initialState1 || !initialState2) return newAutomaton; // Um dos autômatos não tem estado inicial
  
  // Fila para processamento de pares de estados (algoritmo BFS)
  const queue = [[initialState1.id, initialState2.id]];
  const processed = new Set();
  
  while (queue.length > 0) {
    const [id1, id2] = queue.shift();
    const pairKey = `${id1},${id2}`;
    
    if (processed.has(pairKey)) continue;
    processed.add(pairKey);
    
    const state1 = a1.states[id1];
    const state2 = a2.states[id2];
    
    // Criar novo estado para este par
    const newStateId = `q${newAutomaton.currentStateId++}`;
    stateMap[pairKey] = newStateId;
    
    newAutomaton.states[newStateId] = {
      id: newStateId,
      label: newStateId,
      x: (state1.x + state2.x) / 2, // Média das coordenadas
      y: (state1.y + state2.y) / 2,
      isInitial: state1.isInitial && state2.isInitial,
      isFinal: state1.isFinal && state2.isFinal, // Final apenas se ambos forem finais
    };
    
    // Para cada símbolo no alfabeto resultante
    for (const symbol of newAutomaton.alphabet) {
      // Encontrar transições correspondentes em ambos os autômatos
      const transition1 = Object.values(a1.transitions).find(
        t => t.from === id1 && t.symbol === symbol
      );
      
      const transition2 = Object.values(a2.transitions).find(
        t => t.from === id2 && t.symbol === symbol
      );
      
      if (transition1 && transition2) {
        const nextPair = [transition1.to, transition2.to];
        const nextPairKey = nextPair.join(',');
        
        // Adicionar à fila se ainda não foi processado
        if (!processed.has(nextPairKey)) {
          queue.push(nextPair);
        }
        
        // Criar o estado destino se ainda não existe
        if (!stateMap[nextPairKey]) {
          const nextState1 = a1.states[transition1.to];
          const nextState2 = a2.states[transition2.to];
          
          const newNextStateId = `q${newAutomaton.currentStateId++}`;
          stateMap[nextPairKey] = newNextStateId;
          
          newAutomaton.states[newNextStateId] = {
            id: newNextStateId,
            label: newNextStateId,
            x: (nextState1.x + nextState2.x) / 2,
            y: (nextState1.y + nextState2.y) / 2,
            isInitial: false,
            isFinal: nextState1.isFinal && nextState2.isFinal,
          };
        }
        
        // Criar a transição no novo autômato
        const newFrom = stateMap[pairKey];
        const newTo = stateMap[nextPairKey];
        const newTransitionId = `${newFrom}-${symbol}-${newTo}`;
        
        newAutomaton.transitions[newTransitionId] = {
          id: newTransitionId,
          from: newFrom,
          to: newTo,
          symbol: symbol,
        };
      }
    }
  }
  
  return newAutomaton;
}

// Função aprimorada para simular uma cadeia em um autômato (AFD/AFN)
function simulateAutomaton(automaton, input) {
  // Encontrar o estado inicial
  const initialState = Object.values(automaton.states).find(s => s.isInitial);
  if (!initialState) return false;
  
  // Função para obter estados alcançáveis por epsilon-transições
  function getEpsilonClosure(stateIds) {
    let result = [...stateIds];
    let changed = true;
    
    while (changed) {
      changed = false;
      const currentLength = result.length;
      
      for (const stateId of result) {
        const epsilonTransitions = Object.values(automaton.transitions).filter(
          t => t.from === stateId && t.symbol === 'ε'
        );
        
        for (const transition of epsilonTransitions) {
          if (!result.includes(transition.to)) {
            result.push(transition.to);
            changed = true;
          }
        }
      }
      
      if (result.length === currentLength) changed = false;
    }
    
    return result;
  }
  
  // Para AFD, começamos do estado inicial
  if (automaton.type === 'dfa') {
    let currentState = initialState.id;
    
    for (const symbol of input) {
      // Verificar se o símbolo está no alfabeto
      if (!automaton.alphabet.includes(symbol)) return false;
      
      // Encontrar a transição
      const transition = Object.values(automaton.transitions).find(
        t => t.from === currentState && t.symbol === symbol
      );
      
      if (!transition) return false; // Rejeitado se não houver transição
      
      currentState = transition.to;
    }
    
    // Verifica se o estado final é de aceitação
    return automaton.states[currentState].isFinal;
  } 
  // Para AFN, podemos ter múltiplos estados ativos
  else {
    let currentStates = getEpsilonClosure([initialState.id]);
    
    for (const symbol of input) {
      // Verificar se o símbolo está no alfabeto
      if (!automaton.alphabet.includes(symbol) && symbol !== 'ε') return false;
      
      let nextStates = [];
      
      // Para cada estado atual, encontrar todas as transições possíveis
      for (const stateId of currentStates) {
        const transitions = Object.values(automaton.transitions).filter(
          t => t.from === stateId && t.symbol === symbol
        );
        
        for (const transition of transitions) {
          if (!nextStates.includes(transition.to)) {
            nextStates.push(transition.to);
          }
        }
      }
      
      // Aplicar epsilon-fechamento aos estados resultantes
      nextStates = getEpsilonClosure(nextStates);
      
      if (nextStates.length === 0) return false; // Rejeitado se não houver próximos estados
      
      currentStates = nextStates;
    }
    
    // Verifica se algum estado atual é final
    return currentStates.some(stateId => automaton.states[stateId].isFinal);
  }
}

export const automatonSlice = createSlice({
  name: 'automaton',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    addSymbol: (state, action) => {
      const symbol = action.payload;
      if (!state.alphabet.includes(symbol)) {
        state.alphabet.push(symbol);
      }
    },
    removeSymbol: (state, action) => {
      const symbol = action.payload;
      state.alphabet = state.alphabet.filter(s => s !== symbol);
      
      // Remover transições que usam este símbolo
      Object.keys(state.transitions).forEach(id => {
        if (state.transitions[id].symbol === symbol) {
          delete state.transitions[id];
        }
      });
    },
    addState: (state, action) => {
      const { x, y, isInitial, isFinal } = action.payload;
      const id = `q${state.currentStateId}`;
      const newState = new State(id, id, x, y, isInitial, isFinal);
      
      // Se for estado inicial, remover o status de inicial de outros estados
      if (isInitial) {
        Object.keys(state.states).forEach(stateId => {
          state.states[stateId].isInitial = false;
        });
      }
      
      state.states[id] = newState;
      state.currentStateId += 1;
    },
    updateState: (state, action) => {
      const { id, ...updates } = action.payload;
      
      if (state.states[id]) {
        // Se estiver definindo como inicial, remover o status de inicial de outros estados
        if (updates.isInitial) {
          Object.keys(state.states).forEach(stateId => {
            if (stateId !== id) {
              state.states[stateId].isInitial = false;
            }
          });
        }
        
        state.states[id] = { ...state.states[id], ...updates };
      }
    },
    removeState: (state, action) => {
      const id = action.payload;
      
      // Remover o estado
      delete state.states[id];
      
      // Remover transições relacionadas a este estado
      Object.keys(state.transitions).forEach(transitionId => {
        const transition = state.transitions[transitionId];
        if (transition.from === id || transition.to === id) {
          delete state.transitions[transitionId];
        }
      });
    },
    addTransition: (state, action) => {
      const { from, to, symbol } = action.payload;
      
      // Verificar se o símbolo está no alfabeto
      if (!state.alphabet.includes(symbol)) {
        state.error = `Símbolo '${symbol}' não está no alfabeto`;
        return;
      }
      
      // Para AFDs, verificar se já existe uma transição do mesmo estado com o mesmo símbolo
      if (state.type === 'dfa') {
        const existingTransition = Object.values(state.transitions).find(
          t => t.from === from && t.symbol === symbol
        );
        
        if (existingTransition) {
          state.error = `AFD já possui uma transição do estado ${from} com o símbolo ${symbol}`;
          return;
        }
      }
      
      const newTransition = new Transition(from, to, symbol);
      state.transitions[newTransition.id] = newTransition;
      state.error = null;
    },
    updateTransition: (state, action) => {
      const { id, ...updates } = action.payload;
      
      if (state.transitions[id]) {
        // Para AFDs, verificar se a atualização não cria uma transição duplicada
        if (state.type === 'dfa' && updates.symbol) {
          const transition = state.transitions[id];
          const existingTransition = Object.values(state.transitions).find(
            t => t.id !== id && t.from === transition.from && t.symbol === updates.symbol
          );
          
          if (existingTransition) {
            state.error = `AFD já possui uma transição do estado ${transition.from} com o símbolo ${updates.symbol}`;
            return;
          }
        }
        
        state.transitions[id] = { ...state.transitions[id], ...updates };
        state.error = null;
      }
    },
    removeTransition: (state, action) => {
      const id = action.payload;
      delete state.transitions[id];
    },
    setSimulationInput: (state, action) => {
      state.simulationInput = action.payload;
    },
    startSimulation: (state) => {
      state.simulationActive = true;
      state.currentSimulationStep = -1;
      state.simulationSteps = [];
      state.simulationResult = null;
      
      // Verificar se há um estado inicial
      const initialState = Object.values(state.states).find(s => s.isInitial);
      if (!initialState) {
        state.error = 'O autômato deve ter um estado inicial';
        state.simulationActive = false;
        return;
      }
      
      // Preparar a simulação com base no tipo de autômato
      if (state.type === 'dfa') {
        // Simulação para AFD
        let currentState = initialState.id;
        const steps = [{ state: currentState, index: 0, symbol: null }];
        
        for (let i = 0; i < state.simulationInput.length; i++) {
          const symbol = state.simulationInput[i];
          
          // Verificar se o símbolo está no alfabeto
          if (!state.alphabet.includes(symbol)) {
            state.error = `Símbolo '${symbol}' não está no alfabeto`;
            state.simulationActive = false;
            return;
          }
          
          // Encontrar a transição
          const transition = Object.values(state.transitions).find(
            t => t.from === currentState && t.symbol === symbol
          );
          
          if (!transition) {
            // Não há transição definida para este símbolo neste estado
            state.simulationResult = 'rejected';
            steps.push({ state: null, index: i + 1, symbol, rejected: true });
            break;
          }
          
          currentState = transition.to;
          steps.push({ state: currentState, index: i + 1, symbol, transition: transition.id });
        }
        
        // Verificar se o estado final é um estado de aceitação
        if (state.simulationResult !== 'rejected') {
          state.simulationResult = state.states[currentState].isFinal ? 'accepted' : 'rejected';
        }
        
        state.simulationSteps = steps;
      } else {
        // Simulação para AFN
        let currentStates = [initialState.id];
        const steps = [{ states: [...currentStates], index: 0, symbol: null }];
        
        // Adicionar estados alcançáveis por ε-transições (se houver)
        currentStates = addEpsilonReachableStates(state, currentStates);
        
        for (let i = 0; i < state.simulationInput.length; i++) {
          const symbol = state.simulationInput[i];
          
          // Verificar se o símbolo está no alfabeto
          if (!state.alphabet.includes(symbol) && symbol !== 'ε') {
            state.error = `Símbolo '${symbol}' não está no alfabeto`;
            state.simulationActive = false;
            return;
          }
          
          // Encontrar todas as transições possíveis
          let nextStates = [];
          const usedTransitions = [];
          
          currentStates.forEach(stateId => {
            const transitions = Object.values(state.transitions).filter(
              t => t.from === stateId && t.symbol === symbol
            );
            
            transitions.forEach(transition => {
              if (!nextStates.includes(transition.to)) {
                nextStates.push(transition.to);
                usedTransitions.push(transition.id);
              }
            });
          });
          
          // Adicionar estados alcançáveis por ε-transições (se houver)
          nextStates = addEpsilonReachableStates(state, nextStates);
          
          if (nextStates.length === 0) {
            // Não há transições possíveis
            state.simulationResult = 'rejected';
            steps.push({ states: [], index: i + 1, symbol, rejected: true });
            break;
          }
          
          currentStates = nextStates;
          steps.push({ 
            states: [...currentStates], 
            index: i + 1, 
            symbol, 
            transitions: usedTransitions 
          });
        }
        
        // Verificar se algum dos estados atuais é um estado de aceitação
        if (state.simulationResult !== 'rejected') {
          const hasAcceptingState = currentStates.some(stateId => state.states[stateId].isFinal);
          state.simulationResult = hasAcceptingState ? 'accepted' : 'rejected';
        }
        
        state.simulationSteps = steps;
      }
    },
    nextSimulationStep: (state) => {
      if (state.simulationActive && state.currentSimulationStep < state.simulationSteps.length - 1) {
        state.currentSimulationStep += 1;
      }
    },
    prevSimulationStep: (state) => {
      if (state.simulationActive && state.currentSimulationStep > 0) {
        state.currentSimulationStep -= 1;
      }
    },
    stopSimulation: (state) => {
      state.simulationActive = false;
      state.currentSimulationStep = -1;
    },
    resetAutomaton: () => initialState,
    importAutomaton: (state, action) => {
      return { ...initialState, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    addAutomaton: (state, action) => {
      state.automatons.push(action.payload);
    },
    selectAutomaton: (state, action) => {
      // action.payload = id do autômato
      if (!state.selectedAutomata.includes(action.payload)) {
        state.selectedAutomata.push(action.payload);
      }
    },
    deselectAutomaton: (state, action) => {
      state.selectedAutomata = state.selectedAutomata.filter(id => id !== action.payload);
    },
    clearSelectedAutomata: (state) => {
      state.selectedAutomata = [];
    },
    composeUnion: (state) => {
      if (state.selectedAutomata.length === 2) {
        const [id1, id2] = state.selectedAutomata;
        const a1 = state.automatons.find(a => a.id === id1);
        const a2 = state.automatons.find(a => a.id === id2);
        const composed = unionAutomata(a1, a2);
        state.automatons.push(composed);
        state.selectedAutomata = [];
      }
    },
    composeConcat: (state) => {
      if (state.selectedAutomata.length === 2) {
        const [id1, id2] = state.selectedAutomata;
        const a1 = state.automatons.find(a => a.id === id1);
        const a2 = state.automatons.find(a => a.id === id2);
        const composed = concatAutomata(a1, a2);
        state.automatons.push(composed);
        state.selectedAutomata = [];
      }
    },
    composeIntersect: (state) => {
      if (state.selectedAutomata.length === 2) {
        const [id1, id2] = state.selectedAutomata;
        const a1 = state.automatons.find(a => a.id === id1);
        const a2 = state.automatons.find(a => a.id === id2);
        const composed = intersectAutomata(a1, a2);
        state.automatons.push(composed);
        state.selectedAutomata = [];
      }
    },
    setActiveAutomaton: (state, action) => {
      state.activeAutomatonId = action.payload;
      state.simulationResult = null;
    },
    simulateInput: (state, action) => {
      const automaton = state.automatons.find(a => a.id === state.activeAutomatonId);
      if (!automaton) {
        state.simulationResult = null;
        return;
      }
      const accepted = simulateAutomaton(automaton, action.payload);
      state.simulationResult = accepted ? 'accepted' : 'rejected';
    },
    clearSimulationResult: (state) => {
      state.simulationResult = null;
    },
  },
});

// Função auxiliar para adicionar estados alcançáveis por ε-transições (para AFNs)
function addEpsilonReachableStates(state, currentStates) {
  if (!state.alphabet.includes('ε')) {
    return currentStates;
  }
  
  let result = [...currentStates];
  let changed = true;
  
  while (changed) {
    changed = false;
    
    result.forEach(stateId => {
      const epsilonTransitions = Object.values(state.transitions).filter(
        t => t.from === stateId && t.symbol === 'ε'
      );
      
      epsilonTransitions.forEach(transition => {
        if (!result.includes(transition.to)) {
          result.push(transition.to);
          changed = true;
        }
      });
    });
  }
  
  return result;
}

export const { 
  setType,
  addSymbol,
  removeSymbol,
  addState,
  updateState,
  removeState,
  addTransition,
  updateTransition,
  removeTransition,
  setSimulationInput,
  startSimulation,
  nextSimulationStep,
  prevSimulationStep,
  stopSimulation,
  resetAutomaton,
  importAutomaton,
  clearError,
  addAutomaton,
  selectAutomaton,
  deselectAutomaton,
  clearSelectedAutomata,
  composeUnion,
  composeConcat,
  composeIntersect,
  setActiveAutomaton,
  simulateInput,
  clearSimulationResult
} = automatonSlice.actions;

export default automatonSlice.reducer;
