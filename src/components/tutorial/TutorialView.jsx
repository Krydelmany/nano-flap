import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startTutorial } from '../../models/tutorialSlice';

const TutorialView = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('intro');
  
  const sections = [
    { id: 'intro', title: 'Introdução', icon: '📚' },
    { id: 'concepts', title: 'Conceitos', icon: '🧠' },
    { id: 'tutorial', title: 'Tutorial', icon: '🎯' },
    { id: 'examples', title: 'Exemplos', icon: '💡' },
    { id: 'tips', title: 'Dicas', icon: '✨' }
  ];

  return (
    <div className="h-full flex">
      {/* Sidebar de navegação */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">


        <nav className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'intro' && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🎯 Simulador de Autômatos Finitos
            </h1>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-6">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                O que é o Nano Flap?
              </h2>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                O Nano Flap é uma ferramenta educacional interativa para criar, visualizar e simular 
                Autômatos Finitos. Oferece uma interface intuitiva para compreender os conceitos fundamentais da teoria dos autômatos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                  ✅ Funcionalidades
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Editor visual interativo</li>
                  <li>• Suporte para AFD e AFN</li>
                  <li>• Simulação passo a passo</li>
                  <li>• Tabela de transições</li>
                  <li>• Modo escuro/claro</li>
                  <li>• Interface responsiva</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'concepts' && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🧠 Conceitos Fundamentais
            </h1>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  🤖 Autômato Finito
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Um autômato finito é um modelo matemático de computação que consiste em:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                  <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                    M = (Q, Σ, δ, q₀, F)
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• <strong>Q:</strong> Conjunto finito de estados</li>
                    <li>• <strong>Σ:</strong> Alfabeto de entrada</li>
                    <li>• <strong>δ:</strong> Função de transição</li>
                    <li>• <strong>q₀:</strong> Estado inicial</li>
                    <li>• <strong>F:</strong> Conjunto de estados finais</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
                    🎯 AFD (Determinístico)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Em um AFD, para cada par (estado, símbolo) existe exatamente uma transição.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Características:</h4>
                    <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                      <li>• Uma transição por símbolo</li>
                      <li>• Execução única e previsível</li>
                      <li>• Mais fácil de implementar</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">
                    🔀 AFN (Não-Determinístico)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Em um AFN, pode haver múltiplas transições para o mesmo par (estado, símbolo).
                  </p>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-3">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Características:</h4>
                    <ul className="text-sm space-y-1 text-orange-600 dark:text-orange-400">
                      <li>• Múltiplas transições possíveis</li>
                      <li>• Suporte a ε-transições</li>
                      <li>• Mais expressivo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tutorial' && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              🎯 Como Usar o Simulador
            </h1>

            <div className="space-y-6">
              {[{
                step: 1,
                title: "Configuração Inicial",
                content: "Escolha o tipo de autômato (AFD/AFN) e defina o alfabeto",
                details: ["Acesse o painel lateral", "Selecione AFD ou AFN", "Adicione símbolos ao alfabeto"],
                color: "blue"
              },
              {
                step: 2,
                title: "Criando Estados",
                content: "Adicione estados ao seu autômato",
                details: ["Clique em 'Adicionar Estado'", "Clique no canvas onde deseja o estado", "Use botão direito para definir propriedades"],
                color: "green"
              },
              {
                step: 3,
                title: "Definindo Transições",
                content: "Conecte os estados com transições",
                details: ["Clique em 'Adicionar Transição'", "Clique no estado origem", "Clique no estado destino", "Escolha o símbolo da transição"],
                color: "purple"
              },
              {
                step: 4,
                title: "Simulação",
                content: "Teste seu autômato com cadeias de entrada",
                details: ["Vá para a aba 'Simulador'", "Digite uma cadeia de teste", "Execute a simulação", "Observe o resultado passo a passo"],
                color: "orange"
              }].map((step) => (
                <div key={step.step} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/20 flex items-center justify-center`}>
                      <span className={`text-${step.color}-600 dark:text-${step.color}-400 font-bold`}>{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold text-${step.color}-600 dark:text-${step.color}-400 mb-2`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{step.content}</p>
                      <ul className="space-y-1">
                        {step.details.map((detail, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'examples' && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              💡 Exemplos Práticos
            </h1>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                  🟢 Exemplo 1: Números Pares de 0s
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Autômato que aceita cadeias com número par de 0s sobre o alfabeto {"{0, 1}"}.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mb-4">
                  <h4 className="font-semibold mb-2">Configuração:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Estados:</strong> q₀ (inicial, final), q₁</li>
                    <li>• <strong>Alfabeto:</strong> {"{0, 1}"}</li>
                    <li>• <strong>Transições:</strong> δ(q₀,0)=q₁, δ(q₀,1)=q₀, δ(q₁,0)=q₀, δ(q₁,1)=q₁</li>
                  </ul>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    ✅ Aceita: "", "00", "11", "0011"
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                    ❌ Rejeita: "0", "000", "01"
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                  🔵 Exemplo 2: Substring "ab"
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Autômato que aceita cadeias que contêm a substring "ab" sobre o alfabeto {"{a, b}"}.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mb-4">
                  <h4 className="font-semibold mb-2">Configuração:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Estados:</strong> q₀ (inicial), q₁, q₂ (final)</li>
                    <li>• <strong>Alfabeto:</strong> {"{a, b}"}</li>
                    <li>• <strong>Transições:</strong> δ(q₀,a)=q₁, δ(q₀,b)=q₀, δ(q₁,a)=q₁, δ(q₁,b)=q₂, δ(q₂,a)=q₂, δ(q₂,b)=q₂</li>
                  </ul>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    ✅ Aceita: "ab", "aab", "abb", "baab"
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                    ❌ Rejeita: "a", "b", "ba", "aa"
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tips' && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              ✨ Dicas e Melhores Práticas
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Dicas de Modelagem</h3>
                  <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                    <li>• Comece sempre com um estado inicial</li>
                    <li>• Pense no que cada estado representa</li>
                    <li>• Use nomes descritivos para estados</li>
                    <li>• Teste com cadeias simples primeiro</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ Verificação</h3>
                  <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                    <li>• Todo estado deve ter transições definidas</li>
                    <li>• Verifique se há exatamente um estado inicial</li>
                    <li>• Teste casos extremos (cadeia vazia, símbolos únicos)</li>
                    <li>• Use a simulação passo a passo para debug</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🎨 Interface</h3>
                  <ul className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
                    <li>• Use o modo escuro para conforto visual</li>
                    <li>• Organize estados de forma clara no canvas</li>
                    <li>• Use o botão direito para acessar opções</li>
                    <li>• Aproveite os atalhos de teclado</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Erros Comuns</h3>
                  <ul className="space-y-2 text-sm text-orange-600 dark:text-orange-400">
                    <li>• Esquecer de definir estado inicial</li>
                    <li>• Estados sem transições para alguns símbolos</li>
                    <li>• Usar símbolos não definidos no alfabeto</li>
                    <li>• Confundir AFD com AFN</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                🚀 Próximos Passos
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 mb-4">
                Agora que você conhece o básico, experimente criar seus próprios autômatos! 
                Comece com exemplos simples e gradualmente aumente a complexidade.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialView;
