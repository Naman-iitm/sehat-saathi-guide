import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdherenceSummary {
    _id: 'taken' | 'skipped';
    count: number;
}

interface MedicationAdherenceChartProps {
    data: AdherenceSummary[];
}

const MedicationAdherenceChart: React.FC<MedicationAdherenceChartProps> = ({ data }) => {
    const COLORS = ['#10b981', '#ef4444'];

    const chartData = [
        { name: 'Taken', value: data.find(d => d._id === 'taken')?.count || 0 },
        { name: 'Skipped', value: data.find(d => d._id === 'skipped')?.count || 0 },
    ].filter(d => d.value > 0);

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const percentage = total > 0 ? Math.round((chartData.find(d => d.name === 'Taken')?.value || 0) / total * 100) : 0;

    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Medication Adherence</CardTitle>
            </CardHeader>
            <CardContent className="relative">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 top-[140px] flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{percentage}%</span>
                    <span className="text-xs text-muted-foreground uppercase">Adherence</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicationAdherenceChart;
