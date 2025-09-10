import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import ControlPanel from './ControlPanel';

const PathfindingGrid = ({ size, onReset }) => {
    const [grid, setGrid] = useState([]);
    const [agentPosition, setAgentPosition] = useState(null);
    const [treasurePosition, setTreasurePosition] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const generateRandomPosition = (excludePositions = []) => {
        let position;
        do {
            position = {
                row: Math.floor(Math.random() * size),
                col: Math.floor(Math.random() * size)
            };
        } while (excludePositions.some(pos =>
            pos.row === position.row && pos.col === position.col
        ));
        return position;
    };

    useEffect(() => {
        initializeGrid();
    }, [size]);

    const initializeGrid = () => {
        const newGrid = Array(size).fill().map(() =>
            Array(size).fill().map(() => ({
                isAgent: false,
                isTreasure: false,
                isVisited: false,
                isPath: false,
                isWall: false
            }))
        );

        const agentPos = generateRandomPosition();
        newGrid[agentPos.row][agentPos.col].isAgent = true;
        setAgentPosition(agentPos);

        const treasurePos = generateRandomPosition([agentPos]);
        newGrid[treasurePos.row][treasurePos.col].isTreasure = true;
        setTreasurePosition(treasurePos);

        setGrid(newGrid);
    };

    const handleAlgorithmSelect = (algorithm) => {
        setSelectedAlgorithm(algorithm);
    };

    const handleStart = () => {
        if (!selectedAlgorithm) {
            alert('لطفاً ابتدا یک الگوریتم انتخاب کنید');
            return;
        }
        setIsRunning(true);
        // todo: Phase 2: algorithm implementation
        console.log(`شروع الگوریتم ${selectedAlgorithm}`);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSelectedAlgorithm('');
        initializeGrid();
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-2xl mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
                    🗺️ شبکه مسیریابی ({size}×{size})
                </h2>
                <button
                    onClick={onReset}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    ↩️ بازگشت
                </button>
            </div>

            <ControlPanel
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmSelect={handleAlgorithmSelect}
                onStart={handleStart}
                onReset={handleReset}
                isRunning={isRunning}
            />

            <div className="flex justify-center my-8">
                <div
                    className="inline-grid gap-1 bg-gray-200 p-4 rounded-2xl shadow-inner"
                    style={{
                        gridTemplateColumns: `repeat(${size}, 1fr)`,
                        gridTemplateRows: `repeat(${size}, 1fr)`
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                row={rowIndex}
                                col={colIndex}
                                cell={cell}
                                size={size}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded border"></div>
                    <span className="text-sm text-gray-600">🤖 ایجنت</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-400 rounded border"></div>
                    <span className="text-sm text-gray-600">💰 گنج</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded border"></div>
                    <span className="text-sm text-gray-600">👁️ بازدید شده</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded border"></div>
                    <span className="text-sm text-gray-600">🛤️ مسیر نهایی</span>
                </div>
            </div>
        </div>
    );
};

export default PathfindingGrid;
