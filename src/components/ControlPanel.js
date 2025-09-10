import React from 'react';

const ControlPanel = ({
                          selectedAlgorithm,
                          onAlgorithmSelect,
                          onStart,
                          onReset,
                          isRunning
                      }) => {
    const algorithms = [
        { id: 'bfs', name: 'BFS', description: 'جستجوی سطح اول' },
        { id: 'dfs', name: 'DFS', description: 'جستجوی عمق اول' },
        { id: 'ucs', name: 'UCS', description: 'جستجوی هزینه یکنواخت' },
        { id: 'astar', name: 'A*', description: 'الگوریتم A ستاره' }
    ];

    return (
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    🧠 انتخاب الگوریتم:
                </h3>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {algorithms.map(algo => (
                        <button
                            key={algo.id}
                            className={`px-6 py-3 border-2 rounded-xl font-bold transition-all duration-200 ${
                                selectedAlgorithm === algo.id
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            } ${
                                isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                            }`}
                            onClick={() => onAlgorithmSelect(algo.id)}
                            disabled={isRunning}
                            title={algo.description}
                        >
                            {algo.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <button
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                        !selectedAlgorithm || isRunning
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-lg'
                    }`}
                    onClick={onStart}
                    disabled={!selectedAlgorithm || isRunning}
                >
                    {isRunning ? '⏳ در حال اجرا...' : '▶️ شروع'}
                </button>

                <button
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                        isRunning
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 shadow-lg'
                    }`}
                    onClick={onReset}
                    disabled={isRunning}
                >
                    🔄 ریست
                </button>
            </div>

            {selectedAlgorithm && (
                <div className="bg-white rounded-xl p-4 border-r-4 border-blue-500">
                    <h4 className="font-bold text-gray-800 mb-2 text-center">
                        ℹ️ الگوریتم انتخاب شده:
                    </h4>
                    <p className="text-gray-600 text-center">
                        {algorithms.find(a => a.id === selectedAlgorithm)?.description}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
