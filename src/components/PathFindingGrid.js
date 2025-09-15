import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import ControlPanel from './ControlPanel';
import StatsPanel from './StatsPanel';
import { bfsAlgorithm, dfsAlgorithm, ucsAlgorithm, aStarAlgorithm } from '../algorithms/pathfinding';

const PathfindingGrid = ({ size, onReset }) => {
    const [grid, setGrid] = useState([]);
    const [agentPosition, setAgentPosition] = useState(null);
    const [treasurePosition, setTreasurePosition] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [selectedHeuristic, setSelectedHeuristic] = useState('manhattan');
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(300);
    const [currentStep, setCurrentStep] = useState(null);
    const [algorithmResult, setAlgorithmResult] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

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
                isCurrent: false,
                isInQueue: false
            }))
        );


        const agentPos = generateRandomPosition();
        newGrid[agentPos.row][agentPos.col].isAgent = true;
        setAgentPosition(agentPos);


        const treasurePos = generateRandomPosition([agentPos]);
        newGrid[treasurePos.row][treasurePos.col].isTreasure = true;
        setTreasurePosition(treasurePos);

        setGrid(newGrid);
        setCurrentStep(null);
        setAlgorithmResult(null);
        setIsCompleted(false);
    };


    const updateGridWithStep = (step) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row =>
                row.map(cell => ({
                    ...cell,
                    isVisited: false,
                    isCurrent: false,
                    isInQueue: false,
                    isPath: false
                }))
            );


            step.visited.forEach(pos => {
                if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
                    newGrid[pos.row][pos.col].isVisited = true;
                }
            });


            if (step.current) {
                const { row, col } = step.current;
                if (newGrid[row] && newGrid[row][col]) {
                    newGrid[row][col].isCurrent = true;
                }
            }

            const queueOrStack = step.queue || step.stack || [];
            queueOrStack.forEach(pos => {
                if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
                    newGrid[pos.row][pos.col].isInQueue = true;
                }
            });


            if (agentPosition) {
                newGrid[agentPosition.row][agentPosition.col].isAgent = true;
            }
            if (treasurePosition) {
                newGrid[treasurePosition.row][treasurePosition.col].isTreasure = true;
            }

            return newGrid;
        });
    };


    const showFinalPath = (path) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row =>
                row.map(cell => ({ ...cell, isPath: false, isCurrent: false }))
            );


            path.forEach((pos, index) => {
                if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
                    if (index > 0 && index < path.length - 1) {
                        newGrid[pos.row][pos.col].isPath = true;
                    }
                }
            });

            if (agentPosition) {
                newGrid[agentPosition.row][agentPosition.col].isAgent = true;
            }
            if (treasurePosition) {
                newGrid[treasurePosition.row][treasurePosition.col].isTreasure = true
            }

            return newGrid;
        });
    };

    const handleAlgorithmSelect = (algorithm, heuristic = 'manhattan') => {
        setSelectedAlgorithm(algorithm);
        setSelectedHeuristic(heuristic);
    };

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
    };

    const handleStart = async () => {
        if (!selectedAlgorithm) {
            alert('لطفاً ابتدا یک الگوریتم انتخاب کنید');
            return;
        }

        setIsRunning(true);
        setIsCompleted(false);
        setAlgorithmResult(null);

        setGrid(prevGrid =>
            prevGrid.map(row =>
                row.map(cell => ({
                    ...cell,
                    isVisited: false,
                    isPath: false,
                    isCurrent: false,
                    isInQueue: false
                }))
            )
        );

        try {
            let result;
            const onStep = (step) => {
                setCurrentStep(step);
                updateGridWithStep(step);
                return Promise.resolve();
            };

            switch (selectedAlgorithm) {
                case 'bfs':
                    result = await bfsAlgorithm(agentPosition, treasurePosition, size, onStep, speed);
                    break;
                case 'dfs':
                    result = await dfsAlgorithm(agentPosition, treasurePosition, size, onStep, speed);
                    break;
                case 'ucs':
                    result = await ucsAlgorithm(agentPosition, treasurePosition, size, onStep, speed);
                    break;
                case 'astar':
                    result = await aStarAlgorithm(agentPosition, treasurePosition, size, onStep, speed, selectedHeuristic);
                    break;
                default:
                    throw new Error('الگوریتم نامعتبر');
            }

            setAlgorithmResult(result);

            if (result.success) {
                await new Promise(resolve => setTimeout(resolve, speed));
                showFinalPath(result.path);
            }

            setIsCompleted(true);
        } catch (error) {
            console.error('خطا در اجرای الگوریتم:', error);
            alert('خطایی در اجرای الگوریتم رخ داد');
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setSelectedAlgorithm('');
        setCurrentStep(null);
        setAlgorithmResult(null);
        setIsCompleted(false);
        initializeGrid();
    };

    const handlePause = () => {
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
                onPause={handlePause}
                isRunning={isRunning}
                speed={speed}
                onSpeedChange={handleSpeedChange}
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
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-500 rounded border"></div>
                    <span className="text-sm text-gray-600">🎯 گره فعلی</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-orange-300 rounded border"></div>
                    <span className="text-sm text-gray-600">📋 در صف/پشته</span>
                </div>
            </div>

            {algorithmResult && isCompleted && (
                <StatsPanel
                    stats={algorithmResult.stats}
                    success={algorithmResult.success}
                />
            )}
        </div>
    );
};

export default PathfindingGrid;
