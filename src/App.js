import React, { useState } from 'react';
import GridSetup from './components/GridSetup';
import './App.css';
import PathfindingGrid from "./components/PathFindingGrid";

function App() {
    const [gridSize, setGridSize] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const handleGridSizeSubmit = (size) => {
        setGridSize(size);
        setGameStarted(true);
    };

    const handleReset = () => {
        setGridSize(null);
        setGameStarted(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5 font-sans">
            <header className="text-center text-white mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                    🔍 گنج کجاست؟
                </h1>
            </header>

            {!gameStarted ? (
                <GridSetup onSubmit={handleGridSizeSubmit} />
            ) : (
                <PathfindingGrid
                    size={gridSize}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}
export default App;