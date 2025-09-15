import React, { useState } from 'react';

const ControlPanel = ({
                          selectedAlgorithm,
                          onAlgorithmSelect,
                          onStart,
                          onReset,
                          onPause,
                          isRunning,
                          speed,
                          onSpeedChange
                      }) => {
    const [selectedHeuristic, setSelectedHeuristic] = useState('manhattan');

    const algorithms = [
        {
            id: 'bfs',
            name: 'BFS',
            description: 'جستجوی سطح اول - تضمین بهترین مسیر',
            color: 'bg-blue-500 hover:bg-blue-600',
            icon: '🔄'
        },
        {
            id: 'dfs',
            name: 'DFS',
            description: 'جستجوی عمق اول - سریع اما نه لزوماً بهینه',
            color: 'bg-green-500 hover:bg-green-600',
            icon: '⬇️'
        },
        {
            id: 'ucs',
            name: 'UCS',
            description: 'جستجوی هزینه یکسان - تضمین کمترین هزینه',
            color: 'bg-purple-500 hover:bg-purple-600',
            icon: '💰'
        },
        {
            id: 'astar',
            name: 'A*',
            description: 'الگوریتم A* - بهینه و هوشمند با هیوریستیک',
            color: 'bg-red-500 hover:bg-red-600',
            icon: '⭐'
        }
    ];

    const speedOptions = [
        { value: 1000, label: 'آهسته', icon: '🐌' },
        { value: 500, label: 'متوسط', icon: '🚶' },
        { value: 300, label: 'سریع', icon: '🏃' },
        { value: 100, label: 'خیلی سریع', icon: '🚀' }
    ];

    const heuristicOptions = [
        {
            value: 'manhattan',
            label: 'منهتن',
            description: 'فاصله منهتن (|x1-x2| + |y1-y2|)',
            icon: '📐'
        },
        {
            value: 'euclidean',
            label: 'اقلیدسی',
            description: 'فاصله مستقیم (√((x1-x2)² + (y1-y2)²))',
            icon: '📏'
        }
    ];

    const handleAlgorithmSelect = (algorithmId) => {
        onAlgorithmSelect(algorithmId, selectedHeuristic);
    };

    const handleHeuristicChange = (heuristic) => {
        setSelectedHeuristic(heuristic);
        if (selectedAlgorithm === 'astar') {
            onAlgorithmSelect('astar', heuristic);
        }
    };

    return (
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            {/* انتخاب الگوریتم */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    🧠 انتخاب الگوریتم:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {algorithms.map(algo => (
                        <button
                            key={algo.id}
                            className={`p-4 border-2 rounded-xl font-bold transition-all duration-200 ${
                                selectedAlgorithm === algo.id
                                    ? `${algo.color} text-white border-transparent shadow-lg`
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            } ${
                                isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                            }`}
                            onClick={() => handleAlgorithmSelect(algo.id)}
                            disabled={isRunning}
                            title={algo.description}
                        >
                            <div className="text-2xl mb-2">{algo.icon}</div>
                            <div className="text-sm">{algo.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* انتخاب هیوریستیک برای A* */}
            {selectedAlgorithm === 'astar' && (
                <div className="mb-6 bg-white rounded-xl p-4 border-2 border-red-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
                        🎯 انتخاب هیوریستیک برای A*:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                        {heuristicOptions.map(option => (
                            <button
                                key={option.value}
                                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    selectedHeuristic === option.value
                                        ? 'bg-red-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-red-100 border border-gray-300'
                                } ${
                                    isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                                }`}
                                onClick={() => handleHeuristicChange(option.value)}
                                disabled={isRunning}
                                title={option.description}
                            >
                                {option.icon} {option.label}
                            </button>
                        ))}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                        {heuristicOptions.find(h => h.value === selectedHeuristic)?.description}
                    </div>
                </div>
            )}

            {/* کنترل سرعت */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    ⚡ سرعت اجرا:
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                    {speedOptions.map(option => (
                        <button
                            key={option.value}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                speed === option.value
                                    ? 'bg-purple-500 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-300'
                            } ${
                                isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                            }`}
                            onClick={() => onSpeedChange(option.value)}
                            disabled={isRunning}
                        >
                            {option.icon} {option.label}
                        </button>
                    ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                    تأخیر: {speed} میلی‌ثانیه
                </div>
            </div>

            {/* دکمه‌های کنترل */}
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
                    <p className="text-gray-600 text-center mb-2">
                        {algorithms.find(a => a.id === selectedAlgorithm)?.description}
                    </p>
                    {selectedAlgorithm === 'astar' && (
                        <p className="text-sm text-blue-600 text-center">
                            هیوریستیک: {heuristicOptions.find(h => h.value === selectedHeuristic)?.label}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
