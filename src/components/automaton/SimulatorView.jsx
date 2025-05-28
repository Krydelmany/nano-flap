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
    <div className="h-full flex flex-col">
      {/* Header compacto */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Simulador</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Teste cadeias de entrada no seu autômato
              </p>
            </div>
          </div>

          {/* Status do autômato */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isReadyForSimulation()
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            {isReadyForSimulation() ? '✓ Pronto para simular' : '⚠ Autômato incompleto'}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {/* Painel de entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Cadeia de Entrada</h3>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={simulationInput}
            onChange={handleInputChange}
            placeholder="Digite a cadeia (ex: 0101)"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            disabled={simulationActive}
          />
          
          {simulationActive ? (
            <button
              onClick={handleStopSimulation}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                <span>Parar</span>
              </div>
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!isReadyForSimulation() || !simulationInput}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                </svg>
                <span>Simular</span>
              </div>
            </button>
          )}
        </div>
        
        {!isReadyForSimulation() && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-1">
                  Autômato não está pronto para simulação
                </p>
                <ul className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
                  <li>• Pelo menos um estado</li>
                  <li>• Um estado inicial</li>
                  <li>• Pelo menos um estado final</li>
                  <li>• Pelo menos uma transição</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controles de simulação */}
      {simulationActive && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simulação Passo a Passo
            </h3>
            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
              {currentSimulationStep + 1} / {simulationSteps.length}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevStep}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentSimulationStep <= 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Anterior</span>
            </button>
            
            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentSimulationStep >= simulationSteps.length - 1}
            >
              <span className="text-sm">Próximo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Estado atual da simulação */}
          {currentStep && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Entrada</p>
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 rounded px-2 py-1 border">
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
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Símbolo Atual</p>
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 rounded px-2 py-1 border">
                    {currentStep.symbol !== null ? currentStep.symbol : 'Início'}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Estado(s)</p>
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 rounded px-2 py-1 border">
                    {currentStep.state ? (
                      states[currentStep.state]?.label
                    ) : currentStep.states ? (
                      currentStep.states.map(stateId => states[stateId]?.label).join(', ')
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Rejeitado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Resultado da simulação */}
      {simulationResult && (
        <div className={`rounded-lg p-4 ${
          simulationResult === 'accepted' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            {simulationResult === 'accepted' ? (
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <h3 className={`font-semibold ${
                simulationResult === 'accepted' 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {simulationResult === 'accepted' ? 'Cadeia Aceita!' : 'Cadeia Rejeitada'}
              </h3>
              <p className={`text-sm ${
                simulationResult === 'accepted' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {simulationResult === 'accepted' 
                  ? 'A cadeia foi aceita pelo autômato finito.' 
                  : 'A cadeia foi rejeitada pelo autômato.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatorView;
