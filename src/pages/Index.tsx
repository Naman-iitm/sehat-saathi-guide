import PreventiveHealthTips from "@/components/PreventiveHealthTips";
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
  HelpCircle,
} from 'lucide-react';

import { medicines } from '@/data/medicines';
import { governmentSchemes } from '@/data/schemes';

interface Feature {
  path: string;
  label: string;
  labelHi: string;
  descHi: string;
  descEn: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

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

  const features: Feature[] = [
    {
      path: '/symptoms',
      label: t.symptomTracker,
      labelHi: 'लक्षण ट्रैकर',
      descHi: 'अपनी तकलीफ लिखें',
      descEn: 'Record symptoms',
      icon: Stethoscope,
    },
    {
      path: '/tips',
      label: t.healthTips,
      labelHi: 'स्वास्थ्य सुझाव',
      descHi: 'सरल स्वास्थ्य टिप्स',
      descEn: 'Simple tips',
      icon: Lightbulb,
    },
    {
      path: '/store',
      label: t.medicineStore,
      labelHi: 'दवाई दुकान',
      descHi: '27% तक बचत',
      descEn: 'Save 27%',
      icon: Pill,
    },
    {
      path: '/assistant',
      label: t.aiAssistant,
      labelHi: 'AI सहायक',
      descHi: 'स्वास्थ्य मार्गदर्शन',
      descEn: 'Health guidance',
      icon: Bot,
    },
    {
      path: '/schemes',
      label: t.sarkariYojana,
      labelHi: 'सरकारी योजना',
      descHi: 'मुफ्त सेवाएं',
      descEn: 'Free services',
      icon: Shield,
    },
    {
      path: '/nearby',
      label: t.nearbyHospitals,
      labelHi: 'नजदीकी अस्पताल',
      descHi: 'अस्पताल खोजें',
      descEn: 'Find hospitals',
      icon: Hospital,
    },
    {
      path: '/blogs',
      label: 'Health Blogs',
      labelHi: 'स्वास्थ्य ब्लॉग',
      descHi: 'नया पढ़ें',
      descEn: 'Read new',
      icon: FileText,
    },
    {
      path: '/offers',
      label: 'Health Plus',
      labelHi: 'Health Plus',
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

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center text-white overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src="/video/video.mp4" type="video/mp4" />
          </video>

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-3 sm:px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
              <Shield className="w-3 sm:w-4 h-3 sm:h-4" />
              {language === 'hi'
                ? 'विश्वसनीय डिजिटल स्वास्थ्य प्लेटफ़ॉर्म'
                : 'Trusted Digital Health Platform'}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 drop-shadow-lg leading-tight">
              {t.appName}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
              {language === 'hi'
                ? 'आपका स्वास्थ्य, हमारी प्राथमिकता — सरल, सुरक्षित और हर समय उपलब्ध'
                : 'Your health, our priority — simple, secure, and available anytime'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-14">
              <Button
                size="lg"
                className="gap-2 shadow-xl text-sm sm:text-base py-2 sm:py-3 h-auto"
                onClick={() => navigate('/symptoms')}
              >
                <Activity className="w-4 sm:w-5 h-4 sm:h-5" />
                {language === 'hi' ? 'लक्षण जांचें' : 'Check Symptoms'}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary text-sm sm:text-base py-2 sm:py-3 h-auto"
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                {language === 'hi' ? 'ऐप कैसे काम करता है' : 'How it works'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4"
                >
                  <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-semibold">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/80">
                    {language === 'hi' ? stat.labelHi : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {language === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {features.map((feature) => (
          <Link key={feature.path} to={feature.path}>
  <Card
    className="
      relative group h-full
      rounded-2xl
      bg-card
      border border-white/10
      overflow-hidden

      /* resting */
      shadow-[0_6px_18px_rgba(0,0,0,0.35)]

      /* animation */
      transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]

      /* hover */
      hover:-translate-y-3
      hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)]
      hover:border-emerald-400/50
    "
  >
    <CardContent className="relative p-0">

      
      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.25),transparent_65%)]
          pointer-events-none
        "
      />

      
      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent
          pointer-events-none
        "
      />

      {/* icon section */}
      <div className="relative bg-primary/10 p-4 sm:p-6 text-center">
        <div
          className="
            inline-flex rounded-xl p-3
            transition-all duration-500
            group-hover:scale-110
            group-hover:-translate-y-1
            group-hover:shadow-[0_12px_30px_rgba(16,185,129,0.45)]
            bg-primary/10
          "
        >
          <feature.icon className="w-8 sm:w-12 h-8 sm:h-12 text-primary" />
        </div>
      </div>

      {/* content */}
      <div className="relative p-3 sm:p-4 text-center space-y-1">
        <h3
          className="
            font-medium text-xs sm:text-sm line-clamp-2
            transition-colors duration-300
            group-hover:text-primary
          "
        >
          {language === 'hi' ? feature.labelHi : feature.label}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {language === 'hi' ? feature.descHi : feature.descEn}
        </p>

        <div className="mt-3 flex items-center justify-center gap-1 text-primary">
          <span className="text-xs sm:text-sm">{
            language === 'hi' ? 'खोलें' : 'Open'
          }</span>

          <ArrowRight
            className="
              w-4 h-4
              transition-transform duration-300
              group-hover:translate-x-1
            "
          />
        </div>
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
            </form>
          </CardContent>
        </Card>
      </section>

      {/* TODAY'S HEALTH TIP */}
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

      {/* ✅ PREVENTIVE HEALTH TIPS (ISSUE #282) */}
      <section className="container mx-auto px-4 py-12">
        <PreventiveHealthTips />
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
