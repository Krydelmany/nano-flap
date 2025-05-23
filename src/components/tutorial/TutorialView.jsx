import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startTutorial } from '../../models/tutorialSlice';

const TutorialView = () => {
  const dispatch = useDispatch();
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Documentação</h2>
        
        <button
          onClick={() => dispatch(startTutorial())}
          className="btn btn-primary"
        >
          Tutorial
        </button>
      </div>
      
      <div className="card mb-4">
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">
          Simulador de Autômatos Finitos
        </h3>
        
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Este simulador permite criar, editar e simular Autômatos Finitos Determinísticos (AFDs) e 
          Autômatos Finitos Não-Determinísticos (AFNs). Você pode construir autômatos visualmente ou 
          através de uma tabela de transições, e testar se determinadas cadeias são aceitas.
        </p>
        
        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Conceitos Básicos
        </h4>
        
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li className="mb-2">
            <strong>Autômato Finito:</strong> Um modelo matemático de computação que consiste em um 
            conjunto finito de estados e transições entre esses estados.
          </li>
          <li className="mb-2">
            <strong>AFD (Autômato Finito Determinístico):</strong> Um autômato onde, para cada estado 
            e símbolo de entrada, existe exatamente uma transição para outro estado.
          </li>
          <li className="mb-2">
            <strong>AFN (Autômato Finito Não-Determinístico):</strong> Um autômato onde, para cada 
            estado e símbolo de entrada, pode existir zero, uma ou múltiplas transições para outros estados.
          </li>
          <li className="mb-2">
            <strong>Estado Inicial:</strong> O estado em que o autômato começa a processar a entrada.
          </li>
          <li className="mb-2">
            <strong>Estados Finais (ou de aceitação):</strong> Estados que, se alcançados ao final da 
            entrada, indicam que a cadeia foi aceita pelo autômato.
          </li>
          <li className="mb-2">
            <strong>Alfabeto:</strong> Conjunto de símbolos que o autômato reconhece como entrada.
          </li>
          <li className="mb-2">
            <strong>Transição:</strong> Uma regra que define para qual estado o autômato deve ir ao 
            ler um determinado símbolo em um determinado estado.
          </li>
          <li className="mb-2">
            <strong>ε-transição:</strong> Em AFNs, uma transição que não consome nenhum símbolo de entrada.
          </li>
        </ul>
        
        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Como Usar o Simulador
        </h4>
        
        <ol className="list-decimal ml-6 mb-4 text-gray-700 dark:text-gray-300">
          <li className="mb-2">
            <strong>Escolha o tipo de autômato:</strong> Selecione entre AFD ou AFN no painel lateral.
          </li>
          <li className="mb-2">
            <strong>Defina o alfabeto:</strong> Adicione os símbolos que seu autômato irá reconhecer.
          </li>
          <li className="mb-2">
            <strong>Crie estados:</strong> No modo visual, clique no canvas para adicionar estados.
          </li>
          <li className="mb-2">
            <strong>Defina estados iniciais e finais:</strong> Clique com o botão direito em um estado 
            para definir se ele é inicial ou final.
          </li>
          <li className="mb-2">
            <strong>Crie transições:</strong> Clique em um estado e arraste para outro para criar uma 
            transição. Você será solicitado a inserir o símbolo para esta transição.
          </li>
          <li className="mb-2">
            <strong>Alterne entre visualizações:</strong> Use os botões "Visual" e "Tabela" para 
            alternar entre a visualização gráfica e a tabela de transições.
          </li>
          <li className="mb-2">
            <strong>Simule o autômato:</strong> Vá para a aba "Simulador", insira uma cadeia de 
            entrada e clique em "Simular" para ver se a cadeia é aceita ou rejeitada.
          </li>
          <li className="mb-2">
            <strong>Simulação passo a passo:</strong> Use os botões "Anterior" e "Próximo" para 
            ver a execução do autômato passo a passo.
          </li>
        </ol>
        
        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Dicas
        </h4>
        
        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">
            Para AFDs, cada estado deve ter exatamente uma transição para cada símbolo do alfabeto.
          </li>
          <li className="mb-2">
            Para AFNs, você pode adicionar ε-transições (transições vazias) que não consomem símbolos.
          </li>
          <li className="mb-2">
            Todo autômato deve ter exatamente um estado inicial.
          </li>
          <li className="mb-2">
            Um autômato pode ter zero ou mais estados finais.
          </li>
          <li className="mb-2">
            Use o modo escuro para reduzir o cansaço visual em ambientes com pouca luz.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TutorialView;
