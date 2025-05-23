import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../../models/uiSlice'; 
import { resetAutomaton, importAutomaton } from '../../models/automatonSlice'; 

const MainMenu = () => {
  const dispatch = useDispatch();
  const { menuOpen } = useSelector((state) => state.ui);
  const automatonState = useSelector((state) => state.automaton);

  if (!menuOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem('automaton-state', JSON.stringify(automatonState));
      alert('Autômato salvo localmente!');
    } catch (e) {
      console.error("Erro ao salvar no localStorage: ", e);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(automatonState));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "automaton_state.json");
      document.body.appendChild(downloadAnchorNode); 
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
    dispatch(toggleMenu());
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const loadedState = JSON.parse(event.target.result);
            dispatch(importAutomaton(loadedState)); 
            alert('Autômato carregado!');
          } catch (error) {
            alert('Erro ao carregar arquivo: ' + error.message);
            console.error('Erro ao carregar autômato:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    dispatch(toggleMenu());
  };

  const handleExportImage = () => {
    alert('Funcionalidade de exportar imagem ainda não implementada.');
    dispatch(toggleMenu());
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar o autômato? Todas as alterações não salvas serão perdidas.')) {
      dispatch(resetAutomaton());
    }
    dispatch(toggleMenu());
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 flex justify-end"
      onClick={() => dispatch(toggleMenu())} 
    >
      <aside 
        className="w-64 h-full bg-white dark:bg-dark-700 shadow-xl p-4 flex flex-col space-y-2 z-50"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-lg font-semibold mb-2 border-b pb-2 border-gray-200 dark:border-dark-600">Menu Principal</h2>
        <button 
          onClick={handleSave}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          Salvar Autômato
        </button>
        <button 
          onClick={handleLoad}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Carregar Autômato
        </button>
        <button 
          onClick={handleExportImage}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Exportar como Imagem
        </button>
        <div className="flex-grow"></div> 
        <button 
          onClick={handleReset}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Resetar Autômato
        </button>
      </aside>
    </div>
  );
};

export default MainMenu;

