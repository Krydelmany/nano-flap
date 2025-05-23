import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSimulationInput, 
  startSimulation, 
  nextSimulationStep, 
  prevSimulationStep, 
  stopSimulation 
} from '../../models/automatonSlice';

const SimulatorView = () => {
  const dispatch = useDispatch();
  const { 
    alphabet, 
    states, 
    transitions, 
    simulationInput, 
    simulationResult, 
    simulationSteps, 
    currentSimulationStep, 
    simulationActive,
    error
  } = useSelector((state) => state.automaton);
  
  const handleInputChange = (e) => {
    dispatch(setSimulationInput(e.target.value));
  };
  
  const handleStartSimulation = () => {
    dispatch(startSimulation());
  };
  
  const handleNextStep = () => {
    dispatch(nextSimulationStep());
  };
  
  const handlePrevStep = () => {
    dispatch(prevSimulationStep());
  };
  
  const handleStopSimulation = () => {
    dispatch(stopSimulation());
  };
  
  // Verificar se o autômato está pronto para simulação
  const isReadyForSimulation = () => {
    // Verificar se há pelo menos um estado
    if (Object.keys(states).length === 0) {
      return false;
    }
    
    // Verificar se há um estado inicial
    const hasInitialState = Object.values(states).some(state => state.isInitial);
    if (!hasInitialState) {
      return false;
    }
    
    // Verificar se há pelo menos um estado final
    const hasFinalState = Object.values(states).some(state => state.isFinal);
    if (!hasFinalState) {
      return false;
    }
    
    // Verificar se há pelo menos uma transição
    if (Object.keys(transitions).length === 0) {
      return false;
    }
    
    return true;
  };
  
  const currentStep = simulationSteps[currentSimulationStep];
  
  return (
    <div className="h-full flex flex-col simulation-panel">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Simulador</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div className="card mb-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Entrada</h3>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={simulationInput}
            onChange={handleInputChange}
            placeholder="Digite a cadeia de entrada"
            className="input flex-1 mr-2"
            disabled={simulationActive}
          />
          
          {simulationActive ? (
            <button
              onClick={handleStopSimulation}
              className="btn btn-outline"
            >
              Parar
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="btn btn-primary"
              disabled={!isReadyForSimulation() || !simulationInput}
            >
              Simular
            </button>
          )}
        </div>
        
        {!isReadyForSimulation() && (
          <div className="text-yellow-600 dark:text-yellow-400 text-sm">
            O autômato não está pronto para simulação. Verifique se ele possui:
            <ul className="list-disc ml-5 mt-1">
              <li>Pelo menos um estado</li>
              <li>Um estado inicial</li>
              <li>Pelo menos um estado final</li>
              <li>Pelo menos uma transição</li>
            </ul>
          </div>
        )}
      </div>
      
      {simulationActive && (
        <div className="card mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Simulação Passo a Passo
          </h3>
          
          <div className="flex justify-between mb-4">
            <button
              onClick={handlePrevStep}
              className="btn btn-outline"
              disabled={currentSimulationStep <= 0}
            >
              Anterior
            </button>
            
            <span className="px-4 py-2">
              Passo {currentSimulationStep + 1} de {simulationSteps.length}
            </span>
            
            <button
              onClick={handleNextStep}
              className="btn btn-outline step-simulation-button"
              disabled={currentSimulationStep >= simulationSteps.length - 1}
            >
              Próximo
            </button>
          </div>
          
          <div className="border border-gray-300 rounded-md p-4 dark:border-dark-600">
            {currentStep && (
              <>
                <div className="mb-2">
                  <span className="font-medium">Entrada:</span>{' '}
                  <span className="font-mono">
                    {simulationInput.split('').map((char, index) => {
                      const isCurrentChar = index === currentStep.index - 1;
                      return (
                        <span
                          key={index}
                          className={isCurrentChar ? 'bg-yellow-200 dark:bg-yellow-900 px-1 rounded' : ''}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="font-medium">Símbolo atual:</span>{' '}
                  <span className="font-mono">
                    {currentStep.symbol !== null ? currentStep.symbol : 'Início'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium">Estado atual:</span>{' '}
                  {currentStep.state ? (
                    <span className="font-mono">{states[currentStep.state]?.label}</span>
                  ) : currentStep.states ? (
                    <span className="font-mono">
                      {currentStep.states.map(stateId => states[stateId]?.label).join(', ')}
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Rejeitado</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {simulationResult && (
        <div className={`card ${
          simulationResult === 'accepted' 
            ? 'bg-green-100 dark:bg-green-900' 
            : 'bg-red-100 dark:bg-red-900'
        }`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Resultado
          </h3>
          
          {simulationResult === 'accepted' ? (
            <div className="text-green-700 dark:text-green-300 font-medium">
              A cadeia foi aceita pelo autômato!
            </div>
          ) : (
            <div className="text-red-700 dark:text-red-300 font-medium">
              A cadeia foi rejeitada pelo autômato.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulatorView;
