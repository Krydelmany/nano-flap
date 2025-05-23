import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentView } from '../../models/uiSlice'; 
import { triggerZoomIn, triggerZoomOut, triggerFitView, toggleInteractivity } from '../../models/canvasSlice'; 
import { toggleTutorial } from '../../models/tutorialSlice';

const BottomBar = () => {
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.ui);
  // const { isInteractive } = useSelector((state) => state.canvas); // Para o botão de interatividade

  return (
    <footer className="bg-white dark:bg-dark-700 shadow-md p-2 flex justify-center items-center space-x-2 z-20">
      {/* Controles de Zoom */}
      <button 
        onClick={() => dispatch(triggerZoomOut())}
        aria-label="Zoom out"
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6" /></svg>
      </button>
      <button 
        onClick={() => dispatch(triggerZoomIn())}
        aria-label="Zoom in"
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-6" /></svg>
      </button>
      <button 
        onClick={() => dispatch(triggerFitView())}
        aria-label="Fit view"
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
      </button>

      {/* Separador */}
      <div className="h-6 border-l border-gray-300 dark:border-dark-500 mx-2"></div>

      {/* Modo Edição/Teste */}
      <button 
        onClick={() => dispatch(setCurrentView('editor'))} 
        className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'editor' ? 'bg-primary-500 text-white dark:bg-primary-600' : 'hover:bg-gray-200 dark:hover:bg-dark-600'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Editor
      </button>
      <button 
        onClick={() => dispatch(setCurrentView('simulator'))} 
        className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'simulator' ? 'bg-primary-500 text-white dark:bg-primary-600' : 'hover:bg-gray-200 dark:hover:bg-dark-600'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Simulador
      </button>

      {/* Separador */}
      <div className="h-6 border-l border-gray-300 dark:border-dark-500 mx-2"></div>

      {/* Botão de Ajuda/Tutorial */}
      <button 
        onClick={() => dispatch(toggleTutorial())} 
        aria-label="Help/Tutorial"
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.152-.468 2.196-1.228 2.962-.76.766-1.804 1.25-2.772 1.25a4.006 4.006 0 01-2.962-1.228C8.696 13.196 8.228 12.152 8.228 11c0-.34.026-.673.076-.998M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 .339-.026.673-.076.998" /></svg>
      </button>

      {/* Botão de Interatividade do Canvas (Exemplo) */}
      {/* <button 
        onClick={() => dispatch(toggleInteractivity())} 
        aria-label="Toggle interactivity"
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-dark-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInteractive ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isInteractive ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />}
        </svg>
      </button> */}
    </footer>
  );
};

export default BottomBar;

