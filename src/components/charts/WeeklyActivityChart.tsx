import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityData {
    _id: string; // Date string
    taken: number;
    skipped: number;
}

interface WeeklyActivityChartProps {
    data: ActivityData[];
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
    // Sort data by date
    const sortedData = [...data].sort((a, b) => a._id.localeCompare(b._id));

    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Medication Tracking Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sortedData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis
                            dataKey="_id"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(str) => new Date(str).toLocaleDateString([], { weekday: 'short' })}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            labelFormatter={(str) => new Date(str).toLocaleDateString()}
                        />
                        <Bar dataKey="taken" name="Taken" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="skipped" name="Skipped" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default WeeklyActivityChart;
