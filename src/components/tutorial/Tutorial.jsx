import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep, prevStep, endTutorial } from '../../models/tutorialSlice';

const Tutorial = () => {
  const dispatch = useDispatch();
  const { steps, currentStep } = useSelector((state) => state.tutorial);
  
  if (currentStep < 0 || currentStep >= steps.length) {
    return null;
  }
  
  const step = steps[currentStep];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-700 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          {step.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {step.content}
        </p>
        
        <div className="flex justify-between">
          <div>
            <button
              onClick={() => dispatch(prevStep())}
              className="btn btn-outline mr-2"
              disabled={currentStep === 0}
            >
              Anterior
            </button>
            
            <button
              onClick={() => dispatch(endTutorial())}
              className="btn btn-outline"
            >
              Fechar
            </button>
          </div>
          
          <button
            onClick={() => dispatch(nextStep())}
            className="btn btn-primary"
          >
            {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
