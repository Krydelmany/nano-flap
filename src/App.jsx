import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from './models/uiSlice';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import EditorView from './components/automaton/EditorView';
import SimulatorView from './components/automaton/SimulatorView';
import TutorialView from './components/tutorial/TutorialView';

function App() {
  const dispatch = useDispatch();
  const { theme, currentView } = useSelector((state) => state.ui);
  const { active: tutorialActive } = useSelector((state) => state.tutorial);

  // Aplicar tema ao carregar e quando mudar
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!localStorage.getItem('theme')) {
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [theme, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4">
          {currentView === 'editor' && <EditorView />}
          {currentView === 'simulator' && <SimulatorView />}
          {currentView === 'tutorial' && <TutorialView />}
        </main>
      </div>
    
    </div>
  );
}

export default App;
