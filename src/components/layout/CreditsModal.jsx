import React, { useState, useEffect } from 'react';

const CreditsModal = ({ isOpen, onClose }) => {
    const [easterEgg, setEasterEgg] = useState(null);
    const [clickCount, setClickCount] = useState(0);

    const developers = [
        {
            name: 'Giovani',
            role: 'Algorithm Wizard',
            emoji: '🧙‍♂️',
            quote: 'Transformando teoria em código e café em algoritmos!',
            color: 'from-purple-500 to-pink-500'
        },
        {
            name: 'Rychard',
            role: 'Logic Engineer and Bug Hunter',
            emoji: '🔧',
            quote: 'Ouvi bug? Talvez não... mas achei mesmo assim!',
            color: 'from-green-500 to-teal-500'
        },
        {
            name: 'Paulo',
            role: 'Documentation King',
            emoji: '📚',
            quote: 'Se está documentado, está feito! (Ou quase...)',
            color: 'from-orange-500 to-red-500'
        },
        {
            name: 'João Paulo',
            role: 'Frontend Master',
            emoji: '🎨',
            quote: 'Tornando autômatos visuais desde 2025. Pixel é arte!',
            color: 'from-blue-500 to-cyan-500'
        },
    ];

    const easterEggs = [
        '🎉 Você desbloqueou o modo FESTA! Os autômatos estão dançando break.',
        '🚀 Turbo Mode: Agora os estados mudam mais rápido que café na madrugada!',
        '🦄 Unicórnio detectado! Dê um nome para ele: ________',
        '🎯 Parabéns! Você clicou mais que o professor corrigindo provas.',
        '🌟 Segredo: Este projeto foi alimentado por pizza, memes e sonhos!',
        '🤖 Os autômatos querem férias, mas continuam trabalhando por você!',
        '🍕 Pizza Mode ativado! (Só falta a pizza mesmo...)',
        '🕹️ Konami Code não funciona aqui, mais valeu tentar!'
    ];

    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);
        if (clickCount >= 4) {
            const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
            setEasterEgg(randomEgg);
            setClickCount(0);
            setTimeout(() => setEasterEgg(null), 3500);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setClickCount(0);
            setEasterEgg(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-purple-400 dark:border-purple-700">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Fechar créditos"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="text-center">
                        <div
                            className="inline-block cursor-pointer transform hover:scale-110 transition-transform"
                            onClick={handleLogoClick}
                            title="Clique 5x para um segredo!"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg animate-pulse">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Nano Flap
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Simulador de Autômatos Finitos v1.0
                        </p>
                        {/* Easter Egg */}
                        {easterEgg && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 animate-bounce">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm text-center">
                                    {easterEgg}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Developers */}
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                        🎯 Equipe de Desenvolvimento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {developers.map((dev) => (
                            <div
                                key={dev.name}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${dev.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                <div className="relative p-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-2xl">{dev.emoji}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                                {dev.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {dev.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">
                                        "{dev.quote}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Info */}
                <div className="px-6 pb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Sobre o Projeto
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                <strong>Tecnologias:</strong> React, Redux Toolkit, Tailwind CSS, React Flow
                            </p>
                            <p>
                                <strong>Versão:</strong> 1.0.0 - "nano" Edition
                            </p>
                            <p>
                                <strong>Easter Egg:</strong> Clique no logo 5 vezes para surpresas! 🎁
                            </p>
                            <p>
                                <strong>Curiosidade:</strong> Nenhum autômato foi ferido durante o desenvolvimento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Feito com ❤️, ☕ e um pouco de magia computacional</p>
                        <p className="mt-1">
                            © 2025 Nano Flap Team - Todos os direitos reservados aos autômatos
                        </p>
                        <p className="mt-1 text-xs italic text-purple-400 dark:text-purple-300">Se você leu até aqui, você é um verdadeiro estado final!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsModal;
