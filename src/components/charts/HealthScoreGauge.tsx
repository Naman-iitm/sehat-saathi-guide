import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthScoreGaugeProps {
    score: number;
}

const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score }) => {
    const data = [
        { name: 'Progress', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const getColor = (val: number) => {
        if (val >= 80) return '#10b981'; // Green
        if (val >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const COLORS = [getColor(score), '#f3f4f6'];

    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Your Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-10">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-[-60px] text-center">
                    <span className="text-5xl font-extrabold" style={{ color: getColor(score) }}>{score}</span>
                    <p className="text-muted-foreground font-medium mt-2">Target: 100</p>
                    <p className="text-sm px-10 mt-4 italic text-muted-foreground">
                        {score >= 80 ? 'Excellent! You are maintaining your health very well.' :
                            score >= 50 ? 'Good, but there is room for improvement in adherence.' :
                                'Attention needed. Please track your symptoms and medications regularly.'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default HealthScoreGauge;
