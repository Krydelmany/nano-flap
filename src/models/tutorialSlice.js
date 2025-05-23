import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  steps: [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Simulador de Autômatos Finitos',
      content: 'Este tutorial irá guiá-lo pelos conceitos básicos de autômatos finitos e como usar este simulador.',
      target: 'body',
      placement: 'center',
    },
    {
      id: 'automaton-type',
      title: 'Tipo de Autômato',
      content: 'Aqui você pode escolher entre criar um Autômato Finito Determinístico (AFD) ou um Autômato Finito Não-Determinístico (AFN).',
      target: '.automaton-type-selector',
      placement: 'bottom',
    },
    {
      id: 'alphabet',
      title: 'Definição do Alfabeto',
      content: 'Defina os símbolos do alfabeto que seu autômato irá reconhecer.',
      target: '.alphabet-input',
      placement: 'bottom',
    },
    {
      id: 'states',
      title: 'Estados',
      content: 'Adicione estados ao seu autômato. Clique no canvas para adicionar um novo estado.',
      target: '.automaton-canvas',
      placement: 'left',
    },
    {
      id: 'initial-state',
      title: 'Estado Inicial',
      content: 'Defina qual estado será o inicial. Todo autômato deve ter exatamente um estado inicial.',
      target: '.initial-state-selector',
      placement: 'right',
    },
    {
      id: 'final-states',
      title: 'Estados Finais',
      content: 'Defina quais estados são finais (ou de aceitação). Um autômato pode ter zero ou mais estados finais.',
      target: '.final-states-selector',
      placement: 'right',
    },
    {
      id: 'transitions',
      title: 'Transições',
      content: 'Crie transições entre os estados. Clique em um estado e arraste para outro para criar uma transição.',
      target: '.automaton-canvas',
      placement: 'bottom',
    },
    {
      id: 'transition-table',
      title: 'Tabela de Transições',
      content: 'Você também pode visualizar e editar as transições em formato de tabela.',
      target: '.transition-table',
      placement: 'top',
    },
    {
      id: 'simulation',
      title: 'Simulação',
      content: 'Teste seu autômato com cadeias de entrada para ver se elas são aceitas ou rejeitadas.',
      target: '.simulation-panel',
      placement: 'left',
    },
    {
      id: 'step-by-step',
      title: 'Simulação Passo a Passo',
      content: 'Veja a execução do autômato passo a passo, com animações das transições entre estados.',
      target: '.step-simulation-button',
      placement: 'bottom',
    },
    {
      id: 'save-load',
      title: 'Salvar e Carregar',
      content: 'Você pode salvar seu autômato para uso futuro e carregar autômatos salvos anteriormente.',
      target: '.save-load-buttons',
      placement: 'bottom',
    },
    {
      id: 'end',
      title: 'Pronto para Começar!',
      content: 'Agora você conhece as funcionalidades básicas do simulador. Explore e crie seus próprios autômatos!',
      target: 'body',
      placement: 'center',
    },
  ],
  currentStep: -1, // -1 significa que o tutorial não está ativo
  active: false,
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    startTutorial: (state) => {
      state.currentStep = 0;
      state.active = true;
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length - 1) {
        state.currentStep += 1;
      } else {
        state.active = false;
        state.currentStep = -1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    endTutorial: (state) => {
      state.active = false;
      state.currentStep = -1;
    },
    goToStep: (state, action) => {
      const stepIndex = action.payload;
      if (stepIndex >= 0 && stepIndex < state.steps.length) {
        state.currentStep = stepIndex;
        state.active = true;
      }
    },
    toggleTutorial: (state) => {
      if (state.active) {
        state.active = false;
        state.currentStep = -1;
      } else {
        state.active = true;
        state.currentStep = 0;
      }
    },
  },
});

export const { 
  startTutorial, 
  nextStep, 
  prevStep, 
  endTutorial,
  goToStep,
  toggleTutorial
} = tutorialSlice.actions;

export default tutorialSlice.reducer;
