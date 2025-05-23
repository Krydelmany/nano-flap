import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { simulateInput, clearSimulationResult } from '../models/automatonSlice';

const SimulatorPanel = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const activeId = useSelector(state => state.automaton.activeAutomatonId);
  const result = useSelector(state => state.automaton.simulationResult);

  const handleSimulate = () => {
    dispatch(simulateInput(input));
  };

  if (!activeId) return <div>Selecione um autômato para simular.</div>;

  return (
    <div>
      <h4>Simular Cadeia</h4>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Digite a cadeia"
      />
      <button onClick={handleSimulate}>Simular</button>
      <button onClick={() => dispatch(clearSimulationResult())}>Limpar</button>
      {result && (
        <div>
          Resultado: {result === 'accepted' ? 'Aceita' : 'Rejeitada'}
        </div>
      )}
    </div>
  );
};

export default SimulatorPanel;
