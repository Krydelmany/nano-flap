import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { automatonSlice } from '../../models/automatonSlice';

// Componente para persistência de estado no localStorage
const AutomatonPersistence = () => {
  const dispatch = useDispatch();
  const automatonState = useSelector((state) => state.automaton);

  // Carregar estado do localStorage ao iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('automaton-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch(automatonSlice.actions.importAutomaton(parsedState));
      } catch (error) {
        console.error('Erro ao carregar estado do autômato:', error);
      }
    }
  }, [dispatch]);

  // Salvar estado no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('automaton-state', JSON.stringify(automatonState));
  }, [automatonState]);

  return null; // Este componente não renderiza nada
};

export default AutomatonPersistence;
