import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTransition, 
  updateTransition, 
  removeTransition,
  updateState
} from '../../models/automatonSlice';

const TransitionTable = () => {
  const dispatch = useDispatch();
  const { states, transitions, alphabet, type } = useSelector((state) => state.automaton);
  
  // Ordenar estados por ID
  const sortedStates = Object.values(states).sort((a, b) => a.id.localeCompare(b.id));
  
  const handleInitialStateChange = (stateId) => {
    dispatch(updateState({
      id: stateId,
      isInitial: true
    }));
  };
  
  const handleFinalStateChange = (stateId, isFinal) => {
    dispatch(updateState({
      id: stateId,
      isFinal: !isFinal
    }));
  };
  
  const handleTransitionChange = (fromState, symbol, value) => {
    // Encontrar transição existente
    const existingTransition = Object.values(transitions).find(
      t => t.from === fromState && t.symbol === symbol
    );
    
    if (existingTransition && value) {
      // Atualizar transição existente
      dispatch(updateTransition({
        id: existingTransition.id,
        to: value
      }));
    } else if (existingTransition && !value) {
      // Remover transição existente
      dispatch(removeTransition(existingTransition.id));
    } else if (!existingTransition && value) {
      // Adicionar nova transição
      dispatch(addTransition({
        from: fromState,
        to: value,
        symbol
      }));
    }
  };
  
  return (
    <div className="overflow-x-auto transition-table">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-dark-600">
            <th className="border border-gray-300 dark:border-dark-500 p-2">Estado</th>
            <th className="border border-gray-300 dark:border-dark-500 p-2">Inicial</th>
            <th className="border border-gray-300 dark:border-dark-500 p-2">Final</th>
            {alphabet.map((symbol) => (
              <th key={symbol} className="border border-gray-300 dark:border-dark-500 p-2">
                {symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStates.map((state) => (
            <tr key={state.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
              <td className="border border-gray-300 dark:border-dark-500 p-2 font-medium">
                {state.label}
              </td>
              <td className="border border-gray-300 dark:border-dark-500 p-2 text-center">
                <input
                  type="radio"
                  name="initialState"
                  checked={state.isInitial}
                  onChange={() => handleInitialStateChange(state.id)}
                  className="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                />
              </td>
              <td className="border border-gray-300 dark:border-dark-500 p-2 text-center">
                <input
                  type="checkbox"
                  checked={state.isFinal}
                  onChange={() => handleFinalStateChange(state.id, state.isFinal)}
                  className="form-checkbox h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                />
              </td>
              {alphabet.map((symbol) => {
                // Encontrar transição para este estado e símbolo
                const transition = Object.values(transitions).find(
                  t => t.from === state.id && t.symbol === symbol
                );
                
                return (
                  <td key={`${state.id}-${symbol}`} className="border border-gray-300 dark:border-dark-500 p-2">
                    {type === 'dfa' ? (
                      <select
                        value={transition ? transition.to : ''}
                        onChange={(e) => handleTransitionChange(state.id, symbol, e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded dark:border-dark-500 dark:bg-dark-700"
                      >
                        <option value="">-</option>
                        {sortedStates.map((targetState) => (
                          <option key={targetState.id} value={targetState.id}>
                            {targetState.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {sortedStates.map((targetState) => {
                          // Verificar se existe uma transição para este estado alvo
                          const hasTransition = Object.values(transitions).some(
                            t => t.from === state.id && t.symbol === symbol && t.to === targetState.id
                          );
                          
                          return (
                            <label key={targetState.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={hasTransition}
                                onChange={() => {
                                  if (hasTransition) {
                                    // Encontrar e remover a transição
                                    const transitionToRemove = Object.values(transitions).find(
                                      t => t.from === state.id && t.symbol === symbol && t.to === targetState.id
                                    );
                                    if (transitionToRemove) {
                                      dispatch(removeTransition(transitionToRemove.id));
                                    }
                                  } else {
                                    // Adicionar nova transição
                                    dispatch(addTransition({
                                      from: state.id,
                                      to: targetState.id,
                                      symbol
                                    }));
                                  }
                                }}
                                className="form-checkbox h-3 w-3 text-primary-600 mr-1"
                              />
                              <span className="text-xs">{targetState.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedStates.length === 0 && (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          Nenhum estado definido. Adicione estados no modo visual.
        </div>
      )}
    </div>
  );
};

export default TransitionTable;
