import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, TrendingUp, Activity, AlertCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { exportDashboardToPDF, exportDashboardToCSV } from '@/lib/exportUtils';

interface DashboardStats {
  totalSymptoms: number;
  averageSeverity: string;
  medicinesPurchased: number;
  appointmentsBooked: number;
  weeklyData: WeeklyData[];
  symptomFrequency: SymptomFrequency[];
  medicineHistory: MedicineHistory[];
  severityTrend: SeverityTrend[];
}

interface WeeklyData {
  date: string;
  symptoms: number;
  severity: number;
}

interface SymptomFrequency {
  name: string;
  value: number;
}

interface MedicineHistory {
  name: string;
  quantity: number;
  date: string;
  price: number;
}

interface SeverityTrend {
  date: string;
  mild: number;
  moderate: number;
  severe: number;
}

const translations = {
  en: {
    title: 'Health Dashboard',
    overview: 'Overview',
    analytics: 'Analytics',
    history: 'History',
    totalSymptoms: 'Total Symptoms',
    severity: 'Avg Severity',
    medicines: 'Medicines Bought',
    appointments: 'Appointments',
    weeklyTrends: 'Weekly Symptom Trends',
    symptomsFrequency: 'Symptom Frequency',
    medicineHistory: 'Medicine Purchase History',
    severityTrends: 'Severity Trends',
    exportPDF: 'Export as PDF',
    exportCSV: 'Export as CSV',
    noData: 'No data available yet',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  hi: {
    title: 'स्वास्थ्य डैशबोर्ड',
    overview: 'अवलोकन',
    analytics: 'विश्लेषण',
    history: 'इतिहास',
    totalSymptoms: 'कुल लक्षण',
    severity: 'औसत गंभीरता',
    medicines: 'दवाएं खरीदी गई',
    appointments: 'नियुक्तियां',
    weeklyTrends: 'साप्ताहिक लक्षण प्रवृत्तियां',
    symptomsFrequency: 'लक्षण आवृत्ति',
    medicineHistory: 'दवा खरीद इतिहास',
    severityTrends: 'गंभीरता प्रवृत्तियां',
    exportPDF: 'PDF के रूप में निर्यात करें',
    exportCSV: 'CSV के रूप में निर्यात करें',
    noData: 'अभी कोई डेटा उपलब्ध नहीं है',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
  },
};

// Color schemes that work in both light and dark modes
const COLORS = ['#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed', '#db2777'];
const SEVERITY_COLORS = { mild: '#059669', moderate: '#d97706', severe: '#dc2626' };

// Chart text colors that adapt to theme
const getChartTextColor = (isDark: boolean) => isDark ? '#e5e7eb' : '#1f2937';

const HealthDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
      const medicines = JSON.parse(localStorage.getItem('cartHistory') || '[]');
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

      // Calculate weekly data (last 7 days)
      const weeklyData = calculateWeeklyData(symptoms);

      // Calculate symptom frequency
      const symptomFrequency = calculateSymptomFrequency(symptoms);

      // Get medicine history
      const medicineHistory = medicines.slice(-5);

      // Calculate severity trends
      const severityTrend = calculateSeverityTrend(symptoms);

      // Calculate average severity
      const averageSeverity = calculateAverageSeverity(symptoms);

      const dashboardStats: DashboardStats = {
        totalSymptoms: symptoms.length,
        averageSeverity,
        medicinesPurchased: medicines.length,
        appointmentsBooked: appointments.length,
        weeklyData,
        symptomFrequency,
        medicineHistory,
        severityTrend,
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyData = (symptoms: any[]): WeeklyData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySymptoms = symptoms.filter((s: any) => s.date === date);
      const severity = daySymptoms.reduce((sum: number, s: any) => {
        return sum + (s.severity === 'high' ? 3 : s.severity === 'medium' ? 2 : 1);
      }, 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        symptoms: daySymptoms.length,
        severity: severity,
      };
    });
  };

  const calculateSymptomFrequency = (symptoms: any[]): SymptomFrequency[] => {
    const frequency: Record<string, number> = {};

    symptoms.forEach((s: any) => {
      frequency[s.name] = (frequency[s.name] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const calculateSeverityTrend = (symptoms: any[]): SeverityTrend[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySymptoms = symptoms.filter((s: any) => s.date === date);
      const mild = daySymptoms.filter((s: any) => s.severity === 'low').length;
      const moderate = daySymptoms.filter((s: any) => s.severity === 'medium').length;
      const severe = daySymptoms.filter((s: any) => s.severity === 'high').length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        mild,
        moderate,
        severe,
      };
    });
  };

  const calculateAverageSeverity = (symptoms: any[]): string => {
    if (symptoms.length === 0) return 'N/A';

    const total = symptoms.reduce((sum: number, s: any) => {
      return sum + (s.severity === 'high' ? 3 : s.severity === 'medium' ? 2 : 1);
    }, 0);

    const average = total / symptoms.length;

    if (average >= 2.5) return t.high;
    if (average >= 1.5) return t.medium;
    return t.low;
  };

  const handleExportPDF = async () => {
    if (!stats) return;
    try {
      await exportDashboardToPDF(stats, language);
      toast.success('Dashboard exported as PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportCSV = async () => {
    if (!stats) return;
    try {
      await exportDashboardToCSV(stats, language);
      toast.success('Dashboard exported as CSV');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats || stats.totalSymptoms === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">{t.noData}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t.totalSymptoms}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSymptoms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {t.severity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSeverity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {t.medicines}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.medicinesPurchased}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.appointments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointmentsBooked}</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-8">
        <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t.exportPDF}
        </Button>
        <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t.exportCSV}
        </Button>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t.weeklyTrends}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="symptoms"
                    stroke="#3b82f6"
                    name={t.totalSymptoms}
                  />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="#ef4444"
                    name={t.severity}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t.symptomsFrequency}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.symptomFrequency}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.symptomFrequency.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.severityTrends}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.severityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mild" stackId="a" fill={SEVERITY_COLORS.mild} />
                    <Bar dataKey="moderate" stackId="a" fill={SEVERITY_COLORS.moderate} />
                    <Bar dataKey="severe" stackId="a" fill={SEVERITY_COLORS.severe} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t.medicineHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Quantity</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.medicineHistory.length > 0 ? (
                      stats.medicineHistory.map((medicine, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{medicine.name}</td>
                          <td className="py-2 px-4">{medicine.quantity}</td>
                          <td className="py-2 px-4">{medicine.date}</td>
                          <td className="py-2 px-4">₹{medicine.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted-foreground">
                          {t.noData}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthDashboard;
