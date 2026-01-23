import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Download,
    TrendingUp,
    Calendar,
    Activity,
    CheckCircle2,
    DownloadCloud,
    FileJson,
    FileSpreadsheet,
    RefreshCw,
    Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SymptomTrendChart from '@/components/charts/SymptomTrendChart';
import MedicationAdherenceChart from '@/components/charts/MedicationAdherenceChart';
import HealthScoreGauge from '@/components/charts/HealthScoreGauge';
import WeeklyActivityChart from '@/components/charts/WeeklyActivityChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HealthDashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const { token } = useAuth();

    const [timeframe, setTimeframe] = useState('month');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);
    const [symptomData, setSymptomData] = useState<any>(null);
    const [adherenceData, setAdherenceData] = useState<any>(null);
    const [healthScore, setHealthScore] = useState<any>(null);

    const fetchAllData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const [trendsRes, symptomsRes, adherenceRes, scoreRes] = await Promise.all([
                fetch(`${API_URL}/api/analytics/trends?timeframe=${timeframe}`, { headers }),
                fetch(`${API_URL}/api/analytics/symptoms?timeframe=${timeframe}`, { headers }),
                fetch(`${API_URL}/api/analytics/adherence?timeframe=${timeframe}`, { headers }),
                fetch(`${API_URL}/api/analytics/health-score`, { headers })
            ]);

            const [trends, symptoms, adherence, score] = await Promise.all([
                trendsRes.json(),
                symptomsRes.json(),
                adherenceRes.json(),
                scoreRes.json()
            ]);

            setAnalytics(trends);
            setSymptomData(symptoms);
            setAdherenceData(adherence);
            setHealthScore(score);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: "Error",
                description: "Failed to load analytics data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [timeframe, token]);

    const exportToCSV = () => {
        if (!symptomData || !adherenceData) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Category,Date,Value,Status\n";

        symptomData.trends.forEach((t: any) => {
            csvContent += `Symptom Severity,${t._id},${t.severity.toFixed(2)},Logged\n`;
        });

        adherenceData.logs.forEach((l: any) => {
            csvContent += `Medication Admission,${l._id},${l.taken},Taken\n`;
            csvContent += `Medication Admission,${l._id},${l.skipped},Skipped\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sehat_saathi_health_data_${timeframe}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Successful", description: "CSV file has been downloaded." });
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(22);
        doc.setTextColor(139, 92, 246); // Primary purple
        doc.text("Sehat Saathi Health Report", pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text(`Timeframe: ${timeframe.toUpperCase()}`, 20, 35);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 42);

        if (healthScore) {
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text(`Overall Health Score: ${healthScore.score}/100`, 20, 60);
            doc.setFontSize(12);
            doc.text(`- Adherence: ${healthScore.breakdown.adherence}/40`, 25, 70);
            doc.text(`- Symptom Management: ${healthScore.breakdown.symptom}/40`, 25, 77);
            doc.text(`- Activity Level: ${healthScore.breakdown.activity}/20`, 25, 84);
        }

        if (symptomData?.commonSymptoms) {
            doc.setFontSize(16);
            doc.text("Top Symptoms Logged", 20, 105);
            const symptomTableData = symptomData.commonSymptoms.map((s: any) => [s._id, s.count]);
            autoTable(doc, {
                startY: 110,
                head: [['Symptom', 'Occurrence Count']],
                body: symptomTableData,
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246] }
            });
        }

        doc.save(`health_report_${new Date().getTime()}.pdf`);
        toast({ title: "Report Generated", description: "Health PDF has been downloaded." });
    };

    if (loading && !analytics) {
        return (
            <div className="container mx-auto py-20 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xl font-medium animate-pulse">Analyzing your health patterns...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{language === 'hi' ? 'स्वास्थ्य विश्लेषण' : 'Health Analytics'}</h1>
                    <p className="text-muted-foreground mt-1">
                        {language === 'hi' ? 'अपने स्वास्थ्य रुझानों और आदतों को ट्रैक करें' : 'Track your health trends and medication habits'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Tabs value={timeframe} onValueChange={setTimeframe} className="bg-muted p-1 rounded-md">
                        <TabsList className="grid grid-cols-3 w-[240px]">
                            <TabsTrigger value="week">{language === 'hi' ? 'सप्ताह' : 'Week'}</TabsTrigger>
                            <TabsTrigger value="month">{language === 'hi' ? 'महीना' : 'Month'}</TabsTrigger>
                            <TabsTrigger value="year">{language === 'hi' ? 'वर्ष' : 'Year'}</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> CSV
                    </Button>
                    <Button variant="default" size="sm" onClick={exportToPDF} className="gap-2 shadow-sm bg-primary hover:bg-primary/90">
                        <DownloadCloud className="w-4 h-4" /> PDF Report
                    </Button>
                </div>
            </div>

            {/* Summary Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Health Score</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold">{healthScore?.score || '--'}</h3>
                                    <span className="text-xs text-green-500 font-semibold flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-0.5" /> Optimal
                                    </span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${healthScore?.score || 0}%` }} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Med Adherence</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold">{Math.round(analytics?.adherenceRate || 0)}%</h3>
                                    <span className="text-xs text-muted-foreground">Target: 95%</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Symptoms Logged</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold">{symptomData?.trends?.length || 0}</h3>
                                    <span className="text-xs text-muted-foreground">Entries in period</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Reminders</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold">{analytics?.activeReminders || 0}</h3>
                                    <span className="text-xs text-muted-foreground">Daily routines</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HealthScoreGauge score={healthScore?.score || 0} />
                <SymptomTrendChart data={symptomData?.trends || []} />
                <MedicationAdherenceChart data={adherenceData?.summary || []} />
                <WeeklyActivityChart data={adherenceData?.logs || []} />
            </div>

            {/* Common Symptoms List */}
            <div className="mt-8">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Key Patterns Spotted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {symptomData?.commonSymptoms?.length > 0 ? (
                                symptomData.commonSymptoms.map((s: any, idx: number) => (
                                    <div key={idx} className="flex flex-col p-4 border rounded-lg bg-secondary/50 min-w-[200px]">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Symptom</span>
                                        <span className="text-lg font-semibold capitalize">{s._id}</span>
                                        <span className="text-sm text-primary mt-1">{s.count} occurrences</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground py-4 italic">No symptoms logged in this timeframe to identify patterns.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HealthDashboard;
