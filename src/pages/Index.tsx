import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import AppTutorial from '@/components/AppTutorial';
import HealthNewsPopup from '@/components/HealthNewsPopup';
import GeminiHealthTip from '@/components/GeminiHealthTip';
import {
  Activity,
  HelpCircle,
  Shield,
  Users,
  Clock,
  ArrowRight,
  Stethoscope,
  Pill,
  Bot,
  Hospital,
  Shield as ShieldIcon,
  AlertTriangle,
  Search,
  FileText,
  Zap,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

import { medicines } from '@/data/medicines';
import { governmentSchemes } from '@/data/schemes';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showTutorial, setShowTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /* ---------------- SEARCH DATA ---------------- */
  const allSearchableItems = [
    ...medicines.map(m => (language === 'hi' ? m.nameHi : m.name)),
    ...governmentSchemes.map(s => (language === 'hi' ? s.nameHi : s.name)),
    'Primary Health Centre',
    'Community Health Centre',
    'District Hospital',
    'Apollo Pharmacy',
    'MedPlus',
  ];

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (!localStorage.getItem('tutorialCompleted')) {
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSuggestions(
        allSearchableItems
          .filter(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5)
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, language]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  /* ---------------- DATA ---------------- */
  const stats = [
    { icon: Users, value: '10K+', hi: 'उपयोगकर्ता', en: 'Users' },
    { icon: Shield, value: '100%', hi: 'सुरक्षित', en: 'Secure' },
    { icon: Clock, value: '24/7', hi: 'उपलब्ध', en: 'Available' },
  ];

  const features = [
    { path: '/symptoms', icon: Stethoscope, hi: 'लक्षण ट्रैकर', en: t.symptomTracker },
    { path: '/tips', icon: Lightbulb, hi: 'स्वास्थ्य सुझाव', en: t.healthTips },
    { path: '/store', icon: Pill, hi: 'दवाई दुकान', en: t.medicineStore },
    { path: '/assistant', icon: Bot, hi: 'AI सहायक', en: t.aiAssistant },
    { path: '/schemes', icon: ShieldIcon, hi: 'सरकारी योजना', en: t.sarkariYojana },
    { path: '/nearby', icon: Hospital, hi: 'नजदीकी अस्पताल', en: t.nearbyHospitals },
    { path: '/tips', icon: FileText, hi: 'स्वास्थ्य ब्लॉग', en: 'Health Blogs' },
    { path: '/store', icon: Zap, hi: 'ऑफर्स', en: 'Offers' },
    { path: '/schemes', icon: Sparkles, hi: 'Health PLUS', en: 'Health PLUS' },
  ];

  return (
    <div className="min-h-screen font-sans">
      <AppTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <HealthNewsPopup />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src="/video/video.mp4" type="video/mp4" />
          </video>

          {/* Light + blur for readability */}
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 backdrop-blur-md" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
              <Shield className="w-4 h-4" />
              {language === 'hi'
                ? 'विश्वसनीय डिजिटल स्वास्थ्य प्लेटफ़ॉर्म'
                : 'Trusted Digital Health Platform'}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow">
              {t.appName}
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              {language === 'hi'
                ? 'आपका स्वास्थ्य, हमारी प्राथमिकता — सरल, सुरक्षित और हर समय उपलब्ध'
                : 'Your health, our priority — simple, secure, and available anytime'}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
              <Button size="lg" className="gap-2 shadow-xl">
                <Activity className="w-5 h-5" />
                {language === 'hi' ? 'लक्षण जांचें' : 'Check Symptoms'}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary"
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="w-5 h-5" />
                {language === 'hi' ? 'ऐप कैसे काम करता है' : 'How it works'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <s.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-semibold">{s.value}</div>
                  <div className="text-sm text-white/80">
                    {language === 'hi' ? s.hi : s.en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {language === 'hi' ? '🌟 हमारी सेवाएं' : '🌟 Our Services'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link key={i} to={f.path}>
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                <CardContent className="p-6 text-center">
                  <f.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium">
                    {language === 'hi' ? f.hi : f.en}
                  </h3>
                  <div className="mt-3 flex justify-center text-primary gap-1">
                    {language === 'hi' ? 'खोलें' : 'Open'}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'दवाइयां, अस्पताल या लक्षण खोजें...'
                    : 'Search medicines, hospitals, or symptoms...'
                }
                className="pl-10 pr-28"
              />
              <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                {language === 'hi' ? 'खोजें' : 'Search'}
              </Button>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-card border rounded-xl mt-2 shadow-lg">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="block w-full text-left px-4 py-3 hover:bg-muted"
                      onClick={() => {
                        setSearchQuery(s);
                        setShowSuggestions(false);
                        navigate(`/store?search=${encodeURIComponent(s)}`);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </section>

      {/* ================= HEALTH TIP ================= */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {language === 'hi' ? '🌟 आज का स्वास्थ्य सुझाव' : "🌟 Today's Health Tip"}
        </h2>
        <div className="max-w-2xl mx-auto">
          <GeminiHealthTip />
        </div>
      </section>

      {/* ================= EMERGENCY ================= */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="border-2 border-destructive bg-destructive/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <h4 className="font-semibold text-destructive">
                  {language === 'hi' ? 'आपातकालीन नंबर' : 'Emergency Number'}
                </h4>
                <p className="font-mono text-xl">108 / 112</p>
              </div>
            </div>
            <Button variant="destructive" onClick={() => window.open('tel:108')}>
              {language === 'hi' ? 'कॉल करें' : 'Call Now'}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
