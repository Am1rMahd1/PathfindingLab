import React from 'react';

const Cell = ({ row, col, cell, size }) => {
    const getCellClasses = () => {
        let classes = [
            'bg-white',
            'border',
            'border-gray-300',
            'flex',
            'items-center',
            'justify-center',
            'relative',
            'cursor-default',
            'transition-all',
            'duration-300',
            'rounded',
            'hover:scale-105',
            'hover:shadow-lg'
        ];

        if (size <= 5) {
            classes.push('w-16', 'h-16', 'text-2xl');
        } else if (size <= 10) {
            classes.push('w-12', 'h-12', 'text-xl');
        } else {
            classes.push('w-8', 'h-8', 'text-sm');
        }

        if (cell.isAgent) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-blue-500', 'text-white', 'shadow-lg');
        }
        if (cell.isTreasure) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-yellow-400', 'text-white', 'shadow-lg');
        }
        if (cell.isVisited && !cell.isAgent && !cell.isTreasure) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-green-500', 'text-white');
        }
        if (cell.isPath && !cell.isAgent && !cell.isTreasure) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-red-500', 'text-white');
        }
        if (cell.isWall) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-gray-800');
        }

        return classes.join(' ');
    };

    const getCellContent = () => {
        if (cell.isAgent) return '🤖';
        if (cell.isTreasure) return '💰';
        return '';
    };

    const showCoords = size <= 10;

    return (
        <div
            className={getCellClasses()}
            data-row={row}
            data-col={col}
            title={`(${row}, ${col})`}
        >
      <span className="z-10 select-none">
        {getCellContent()}
      </span>
            {showCoords && (
                <span className="absolute bottom-0 right-1 text-xs opacity-50 z-0 select-none">
          {row},{col}
        </span>
            )}
        </div>
    );
};

export default Cell;
