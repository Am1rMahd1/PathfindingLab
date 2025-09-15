import React from 'react';

const StatsPanel = ({ stats, success }) => {
    const formatTime = (ms) => {
        if (ms < 1000) return `${ms} میلی‌ثانیه`;
        return `${(ms / 1000).toFixed(2)} ثانیه`;
    };

    const getAlgorithmInfo = (algorithm) => {
        const info = {
            'BFS': {
                name: 'جستجوی سطح اول',
                icon: '🔄',
                color: 'text-blue-600',
                features: ['تضمین بهترین مسیر', 'جستجوی کامل', 'استفاده از صف']
            },
            'DFS': {
                name: 'جستجوی عمق اول',
                icon: '⬇️',
                color: 'text-green-600',
                features: ['سریع', 'کم حافظه', 'استفاده از پشته']
            },
            'UCS': {
                name: 'جستجوی هزینه یکسان',
                icon: '💰',
                color: 'text-purple-600',
                features: ['تضمین کمترین هزینه', 'صف اولویت', 'بهینه برای هزینه‌های مختلف']
            }
        };

        // بررسی A* با هیوریستیک‌های مختلف
        if (algorithm.startsWith('A*')) {
            return {
                name: 'الگوریتم A*',
                icon: '⭐',
                color: 'text-red-600',
                features: ['بهینه و هوشمند', 'استفاده از هیوریستیک', 'سریع‌ترین الگوریتم بهینه']
            };
        }

        return info[algorithm] || {
            name: algorithm,
            icon: '🤖',
            color: 'text-gray-600',
            features: []
        };
    };

    const algorithmInfo = getAlgorithmInfo(stats.algorithm);

    const getPerformanceScore = () => {
        const efficiency = Math.max(0, 100 - (stats.nodesExplored / (stats.pathLength || 1)) * 10);
        return Math.round(efficiency);
    };

    const getOptimalityText = () => {
        if (stats.isOptimal) {
            return { text: 'بهینه ✅', color: 'text-green-600', bg: 'bg-green-100' };
        } else {
            return { text: 'غیر بهینه ❌', color: 'text-red-600', bg: 'bg-red-100' };
        }
    };

    const optimality = getOptimalityText();

    return (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    📊 آمار اجرای الگوریتم
                </h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                    success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {success ? '✅ مسیر پیدا شد!' : '❌ مسیری پیدا نشد!'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">{algorithmInfo.icon}</span>
                        <div>
                            <h4 className={`font-bold ${algorithmInfo.color}`}>
                                {algorithmInfo.name}
                            </h4>
                            <p className="text-sm text-gray-600">{stats.algorithm}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {algorithmInfo.features.map((feature, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <span className="text-xl mr-2">📈</span>
                        آمار عملکرد
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">گره‌های بررسی شده:</span>
                            <span className="font-bold text-blue-600">{stats.nodesExplored}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">طول مسیر:</span>
                            <span className="font-bold text-green-600">{stats.pathLength}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">زمان اجرا:</span>
                            <span className="font-bold text-purple-600">{formatTime(stats.executionTime)}</span>
                        </div>
                        {stats.pathCost !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">هزینه مسیر:</span>
                                <span className="font-bold text-orange-600">{stats.pathCost}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* وضعیت بهینگی */}
                <div className="bg-white rounded-xl p-4 shadow-md">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <span className="text-xl mr-2">🎯</span>
                        وضعیت راه‌حل
                    </h4>
                    <div className="space-y-3">
                        <div className={`px-3 py-2 rounded-lg ${optimality.bg}`}>
              <span className={`font-bold ${optimality.color}`}>
                {optimality.text}
              </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            امتیاز کارایی:
                            <span className="font-bold text-indigo-600 ml-1">
                {getPerformanceScore()}/100
              </span>
                        </div>
                        {stats.heuristic && (
                            <div className="text-sm text-gray-600">
                                نوع هیوریستیک:
                                <span className="font-bold text-red-600 ml-1">
                  {stats.heuristic === 'manhattan' ? 'منهتن' : 'اقلیدسی'}
                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
