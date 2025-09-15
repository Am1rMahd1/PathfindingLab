import React from 'react';

const Cell = ({ row, col, cell, size }) => {
    const getCellClasses = () => {
        let classes = [
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

        // اندازه سلول بر اساس اندازه شبکه
        if (size <= 5) {
            classes.push('w-16', 'h-16', 'text-2xl');
        } else if (size <= 10) {
            classes.push('w-12', 'h-12', 'text-xl');
        } else {
            classes.push('w-8', 'h-8', 'text-sm');
        }

        // رنگ پیش‌فرض
        classes.push('bg-white');

        // اولویت رنگ‌بندی
        if (cell.isAgent) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-blue-500', 'text-white', 'shadow-lg', 'animate-pulse');
        } else if (cell.isTreasure) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-yellow-400', 'text-white', 'shadow-lg', 'animate-pulse');
        } else if (cell.isCurrent) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-purple-500', 'text-white', 'shadow-lg', 'animate-bounce');
        } else if (cell.isPath) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-red-500', 'text-white', 'shadow-md');
        } else if (cell.isVisited) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-green-500', 'text-white', 'opacity-70');
        } else if (cell.isInQueue) {
            classes = classes.filter(c => !c.includes('bg-white'));
            classes.push('bg-orange-300', 'text-gray-700', 'opacity-80');
        }

        return classes.join(' ');
    };

    const getCellContent = () => {
        if (cell.isAgent) return '🤖';
        if (cell.isTreasure) return '💰';
        if (cell.isCurrent) return '🎯';
        return '';
    };

    const showCoords = size <= 10;

    return (
        <div
            className={getCellClasses()}
            data-row={row}
            data-col={col}
            title={`موقعیت: (${row}, ${col})`}
        >
      <span className="z-10 select-none">
        {getCellContent()}
      </span>
            {showCoords && !getCellContent() && (
                <span className="absolute bottom-0 right-1 text-xs opacity-50 z-0 select-none">
          {row},{col}
        </span>
            )}
        </div>
    );
};

export default Cell;
