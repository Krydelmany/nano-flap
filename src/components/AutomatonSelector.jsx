import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAutomaton,
  deselectAutomaton,
  clearSelectedAutomata,
  composeUnion,
  composeConcat,
  composeIntersect,
  setActiveAutomaton,
} from '../models/automatonSlice';

const AutomatonSelector = () => {
  const automatons = useSelector(state => state.automaton.automatons);
  const selected = useSelector(state => state.automaton.selectedAutomata);
  const activeId = useSelector(state => state.automaton.activeAutomatonId);
  const dispatch = useDispatch();

  return (
    <div className="mb-2">
      <h4>Selecionar Autômatos para Composição</h4>
      <ul>
        {automatons.map(a => (
          <li key={a.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={e =>
                  e.target.checked
                    ? dispatch(selectAutomaton(a.id))
                    : dispatch(deselectAutomaton(a.id))
                }
                disabled={
                  !selected.includes(a.id) && selected.length >= 2
                }
              />
              {a.name || a.id}
              <button
                style={{ marginLeft: 8, fontWeight: activeId === a.id ? 'bold' : 'normal' }}
                onClick={() => dispatch(setActiveAutomaton(a.id))}
              >
                {activeId === a.id ? 'Ativo' : 'Ativar'}
              </button>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(composeUnion())} disabled={selected.length !== 2}>
        União
      </button>
      <button onClick={() => dispatch(composeConcat())} disabled={selected.length !== 2}>
        Concatenação
      </button>
      <button onClick={() => dispatch(composeIntersect())} disabled={selected.length !== 2}>
        Interseção
      </button>
      <button onClick={() => dispatch(clearSelectedAutomata())}>Limpar Seleção</button>
    </div>
  );
};

export default AutomatonSelector;
