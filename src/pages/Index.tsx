import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppTutorial from '@/components/AppTutorial';
import HealthNewsPopup from '@/components/HealthNewsPopup';
import GeminiHealthTip from '@/components/GeminiHealthTip';

import {
  Activity,
  Lightbulb,
  Pill,
  Bot,
  Users,
  Clock,
  ArrowRight,
  Stethoscope,
  Shield,
  Hospital,
  AlertTriangle,
  Search,
  FileText,
  Sparkles,
} from 'lucide-react';

import { medicines } from '@/data/medicines';
import { governmentSchemes } from '@/data/schemes';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [showTutorial, setShowTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const allSearchableItems = React.useMemo(
    () => [
      ...medicines.map((m) => (language === 'hi' ? m.nameHi : m.name)),
      ...governmentSchemes.map((s) => (language === 'hi' ? s.nameHi : s.name)),
      'Primary Health Centre',
      'Community Health Centre',
      'District Hospital',
      'Apollo Pharmacy',
      'MedPlus',
    ],
    [language]
  );

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allSearchableItems
        .filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, allSearchableItems]);

  useEffect(() => {
    const completed = localStorage.getItem('tutorialCompleted');
    if (!completed) {
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    { icon: Users, value: '10K+', labelHi: 'उपयोगकर्ता', labelEn: 'Users' },
    { icon: Shield, value: '100%', labelHi: 'सुरक्षित', labelEn: 'Secure' },
    { icon: Clock, value: '24/7', labelHi: 'उपलब्ध', labelEn: 'Available' },
  ];

  const features = [
    {
      path: '/symptoms',
      label: t.symptomTracker,
      hi: 'लक्षण ट्रैकर',
      descHi: 'अपनी तकलीफ लिखें',
      descEn: 'Record symptoms',
      icon: Stethoscope,
    },
    {
      path: '/tips',
      label: t.healthTips,
      hi: 'स्वास्थ्य सुझाव',
      descHi: 'सरल स्वास्थ्य टिप्स',
      descEn: 'Simple tips',
      icon: Lightbulb,
    },
    {
      path: '/store',
      label: t.medicineStore,
      hi: 'दवाई दुकान',
      descHi: '27% तक बचत',
      descEn: 'Save 27%',
      icon: Pill,
    },
    {
      path: '/assistant',
      label: t.aiAssistant,
      hi: 'AI सहायक',
      descHi: 'स्वास्थ्य मार्गदर्शन',
      descEn: 'Health guidance',
      icon: Bot,
    },
    {
      path: '/schemes',
      label: t.sarkariYojana,
      hi: 'सरकारी योजना',
      descHi: 'मुफ्त सेवाएं',
      descEn: 'Free services',
      icon: Shield,
    },
    {
      path: '/nearby',
      label: t.nearbyHospitals,
      hi: 'नजदीकी अस्पताल',
      descHi: 'अस्पताल खोजें',
      descEn: 'Find hospitals',
      icon: Hospital,
    },
    {
      path: '/blogs',
      label: 'Health Blogs',
      hi: 'स्वास्थ्य ब्लॉग',
      descHi: 'नया पढ़ें',
      descEn: 'Read new',
      icon: FileText,
    },
    {
      path: '/offers',
      label: 'Health Plus',
      hi: 'Health Plus',
      descHi: '5% अतिरिक्त बचत',
      descEn: 'Extra savings',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen">
      <AppTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
      <HealthNewsPopup />

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t.appName}
          </h1>
          <p className="text-lg opacity-90 mb-8">
            {language === 'hi'
              ? 'आपका स्वास्थ्य, हमारी प्राथमिकता'
              : 'Your health, our priority'}
          </p>
          <Button size="lg" onClick={() => navigate('/symptoms')}>
            <Activity className="mr-2" />
            {language === 'hi' ? 'लक्षण जांचें' : 'Check Symptoms'}
          </Button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {language === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <Link key={f.path} to={f.path}>
              <Card className="hover:shadow-lg transition-all h-full">
                <CardContent className="p-4 text-center space-y-2">
                  <f.icon className="w-10 h-10 mx-auto text-primary" />
                  <h3 className="font-medium text-sm">
                    {language === 'hi' ? f.hi : f.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === 'hi' ? f.descHi : f.descEn}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-primary text-xs">
                    {language === 'hi' ? 'खोलें' : 'Open'}
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* SEARCH */}
      <section className="container mx-auto px-4 py-8" ref={searchRef}>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
                className="pl-10 pr-24"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                {language === 'hi' ? 'खोजें' : 'Search'}
              </Button>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 bg-card border rounded-md mt-2 w-full">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-muted"
                      onClick={() => {
                        setSearchQuery(s);
                        setShowSuggestions(false);
                        navigate(
                          `/store?search=${encodeURIComponent(s)}`
                        );
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

      {/* HEALTH TIP */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-center mb-4">
          {language === 'hi'
            ? 'आज का स्वास्थ्य सुझाव'
            : "Today's Health Tip"}
        </h2>
        <div className="max-w-xl mx-auto">
          <GeminiHealthTip />
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-destructive" />
              <div>
                <h4 className="font-semibold">Emergency</h4>
                <p className="font-mono text-lg">108 / 112</p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => window.open('tel:108')}
            >
              Call Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
