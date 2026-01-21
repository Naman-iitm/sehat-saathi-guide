import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
    _id: string;
    severity: number;
    logs: number;
}

interface SymptomTrendChartProps {
    data: DataPoint[];
}

const SymptomTrendChart: React.FC<SymptomTrendChartProps> = ({ data }) => {
    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Symptom Severity Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="_id"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        />
                        <YAxis domain={[0, 3]} tick={{ fontSize: 12 }} label={{ value: 'Severity', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelFormatter={(str) => new Date(str).toLocaleDateString()}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="severity"
                            name="Avg Severity"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default SymptomTrendChart;
