import React, { useState } from 'react';

const GridSetup = ({ onSubmit }) => {
    const [size, setSize] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numSize = parseInt(size);

        if (!size || isNaN(numSize)) {
            setError('لطفاً یک عدد وارد کنید');
            return;
        }

        if (numSize < 2 || numSize > 15) {
            setError('عدد باید بین ۲ تا ۱۵ باشد');
            return;
        }

        setError('');
        onSubmit(numSize);
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full mx-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                    🎯 تنظیمات شبکه
                </h2>
                <p className="text-gray-600 mb-8 text-center text-lg">
                    ابعاد شبکه مربعی را وارد کنید (۲ تا ۱۵)
                </p>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-6">
                        <label
                            htmlFor="gridSize"
                            className="block text-right mb-3 font-bold text-gray-700"
                        >
                            اندازه شبکه:
                        </label>
                        <input
                            type="number"
                            id="gridSize"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            min="2"
                            max="15"
                            placeholder="مثال: 8"
                            className={`w-full p-4 border-2 rounded-xl text-lg text-center transition-colors focus:outline-none ${
                                error
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-gray-300 focus:border-blue-500'
                            }`}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
                    >
                        🚀 شروع بازی
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GridSetup;
