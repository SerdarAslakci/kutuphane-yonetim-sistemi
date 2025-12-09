import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ title, value, icon, trend, trendDirection = 'neutral' }: StatCardProps) => {

    const trendColor = {
        up: 'text-green-600 bg-green-50',
        down: 'text-red-600 bg-red-50',
        neutral: 'text-stone-500 bg-stone-100'
    }[trendDirection];

    return (
        <div className="bg-white p-5 rounded-lg border border-amber-200/60 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0 pr-2">
                <p className="text-stone-500 text-sm font-medium mb-1 font-sans truncate">{title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-amber-950 font-serif truncate">{value}</h3>

                {trend && (
                    <span className={`text-[10px] md:text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded ${trendColor}`}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="p-3 bg-stone-50 rounded-lg text-xl md:text-2xl border border-stone-100 text-stone-600 shrink-0">
                {icon}
            </div>
        </div>
    );
};

export default StatCard;