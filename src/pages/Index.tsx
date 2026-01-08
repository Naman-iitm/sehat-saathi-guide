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
  Heart,
  Activity,
  Lightbulb,
  Store,
  MessageCircle,
  Building,
  MapPin,
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
  Droplets,
  AlertTriangle,
  HeartPulse,
  Search,
  FileText,
  ChevronRight,
  Tag,
  Zap,
  Sparkles,
} from 'lucide-react';

// Import data files
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);



  const allSearchableItems = [
    ...medicines.map(m => language === 'hi' ? m.nameHi : m.name),
    ...governmentSchemes.map(s => language === 'hi' ? s.nameHi : s.name),
    'Primary Health Centre',
    'Community Health Centre',
    'District Hospital',
    'City General Hospital',
    'St. Mary\'s Clinic',
    'Apollo Pharmacy',
    'MedPlus',
  ];

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allSearchableItems.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, language, allSearchableItems]);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: language === 'hi' ? 'पर्चा अपलोड किया गया' : 'Prescription Uploaded',
        description: language === 'hi' 
          ? `${file.name} सफलतापूर्वक प्राप्त हुआ।` 
          : `${file.name} has been received successfully.`,
      });
    }
  };

  const features = [
    {
      path: '/symptoms',
      label: t.symptomTracker,
      labelHi: 'लक्षण ट्रैकर',
      descHi: 'अपनी तकलीफ लिखें',
      descEn: 'Record symptoms',
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
      iconComponent: Stethoscope,
    },
    {
      path: '/tips',
      label: t.healthTips,
      labelHi: 'स्वास्थ्य सुझाव',
      descHi: 'सरल स्वास्थ्य टिप्स',
      descEn: 'Simple health tips',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      iconComponent: Lightbulb,
    },
    {
      path: '/store',
      label: t.medicineStore,
      labelHi: 'दवाई दुकान',
      descHi: '27% तक बचत',
      descEn: 'SAVE 27%',
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
      iconComponent: Pill,
    },
    {
      path: '/symptoms',
      label: language === 'hi' ? 'लैब टेस्ट' : 'Lab Tests',
      labelHi: 'लैब टेस्ट',
      descHi: '70% तक छूट',
      descEn: 'UPTO 70% OFF',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconComponent: Activity,
    },
    {
      path: '/assistant',
      label: t.aiAssistant,
      labelHi: 'AI सहायक',
      descHi: 'स्वास्थ्य मार्गदर्शन',
      descEn: 'Health guidance',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconComponent: Bot,
    },
    {
      path: '/assistant',
      label: language === 'hi' ? 'डॉक्टर परामर्श' : 'Doctor Consult',
      labelHi: 'डॉक्टर परामर्श',
      descHi: '₹199 से शुरू',
      descEn: 'FROM ₹199',
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      iconComponent: Users,
    },
    {
      path: '/store',
      label: language === 'hi' ? 'ब्रांडेड विकल्प' : 'Branded Substitute',
      labelHi: 'ब्रांडेड विकल्प',
      descHi: '50% तक बचत',
      descEn: 'UPTO 50% OFF',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      iconComponent: Zap,
    },
    {
      path: '/schemes',
      label: t.sarkariYojana,
      labelHi: 'सरकारी योजना',
      descHi: 'मुफ्त स्वास्थ्य सेवाएं',
      descEn: 'Free health services',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      iconComponent: ShieldIcon,
    },
    {
      path: '/nearby',
      label: t.nearbyHospitals,
      labelHi: 'नजदीकी अस्पताल',
      descHi: 'अस्पताल खोजें',
      descEn: 'Find hospitals',
      color: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      iconComponent: Hospital,
    },
    {
      path: '/tips',
      label: language === 'hi' ? 'स्वास्थ्य ब्लॉग' : 'Health Blogs',
      labelHi: 'स्वास्थ्य ब्लॉग',
      descHi: 'नया पढ़ें',
      descEn: 'READ NEW',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
      iconComponent: FileText,
    },
    {
      path: '/schemes',
      label: 'Health PLUS',
      labelHi: 'Health PLUS',
      descHi: '5% अतिरिक्त बचत',
      descEn: 'SAVE 5% EXTRA',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      iconComponent: Sparkles,
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', labelHi: 'उपयोगकर्ता', labelEn: 'Users' },
    { icon: Shield, value: '100%', labelHi: 'सुरक्षित', labelEn: 'Secure' },
    { icon: Clock, value: '24/7', labelHi: 'उपलब्ध', labelEn: 'Available' },
  ];

  return (
    <div className="min-h-screen font-sans">
      <AppTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <HealthNewsPopup />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-chart-2 text-primary-foreground py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <HeartPulse className="absolute top-10 left-10 w-32 h-32 text-primary-foreground/20 animate-float" style={{ animationDelay: '0s' }} />
          <Hospital className="absolute top-20 right-20 w-24 h-24 text-primary-foreground/20 animate-float" style={{ animationDelay: '1s' }} />
          <Pill className="absolute bottom-10 left-1/4 w-28 h-28 text-primary-foreground/20 animate-float" style={{ animationDelay: '2s' }} />
          <Stethoscope className="absolute bottom-20 right-10 w-20 h-20 text-primary-foreground/20 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-primary-foreground/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 animate-float" />
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              {t.appName}
            </h1>

            <p className="text-lg md:text-xl opacity-90 max-w-md mx-auto mb-8">
              {language === 'hi'
                ? 'आपका स्वास्थ्य, हमारी प्राथमिकता'
                : 'Your health, our priority'}
            </p>

            <Button
              onClick={() => setShowTutorial(true)}
              variant="secondary"
              size="lg"
              className="gap-2 shadow-lg"
            >
              <HelpCircle className="w-5 h-5" />
              {language === 'hi'
                ? 'ऐप कैसे इस्तेमाल करें?'
                : 'How to use this app?'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto mt-12">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-primary-foreground/10 rounded-xl p-4">
                <stat.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-sm opacity-80">
                  {language === 'hi' ? stat.labelHi : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Our Services Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {language === 'hi' ? '🌟 हमारी सेवाएं' : '🌟 Our Services'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="border-2 hover:shadow-xl transition-all hover:-translate-y-1 h-full overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${feature.color} p-6 text-center`}>
                    <feature.iconComponent className={`w-12 h-12 mx-auto ${feature.iconColor}`} />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium mb-1">{language === 'hi' ? feature.labelHi : feature.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? feature.descHi : feature.descEn}
                    </p>
                    <div className="mt-4 flex items-center justify-center text-primary gap-1">
                      {language === 'hi' ? 'खोलें' : 'Open'}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 reveal">
        <Card className="border-2 border-border shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {language === 'hi' ? 'आप क्या खोज रहे हैं?' : 'What are you looking for?'}
                </h2>
                <div className="relative mt-4" ref={searchRef}>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                      placeholder={language === 'hi' ? 'दवाइयां, अस्पताल या लक्षण खोजें...' : 'Search for medicines, hospitals, or symptoms...'}
                      className="w-full pl-10 pr-24 md:pr-32 py-6 md:py-7 bg-muted/50 border-2 border-border rounded-xl focus-visible:ring-primary text-sm md:text-base"
                    />
                    <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 md:px-8 h-9 md:h-11 text-xs md:text-sm">
                      {language === 'hi' ? 'खोजें' : 'Search'}
                    </Button>
                  </form>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-0"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSuggestions(false);
                            navigate(`/store?search=${encodeURIComponent(suggestion)}`);
                          }}
                        >
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Category Quick Links */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {['Medicine', 'Healthcare', 'Lab Tests', 'Doctor Consult', 'Offers'].map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => {
                        setSearchQuery(cat);
                        navigate(`/store?search=${encodeURIComponent(cat)}`);
                      }}
                      className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Daily Health Tip */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {language === 'hi' ? '🌟 आज का स्वास्थ्य सुझाव' : '🌟 Today\'s Health Tip'}
        </h2>
        <div className="max-w-2xl mx-auto">
          <GeminiHealthTip />
        </div>
      </section>



      {/* Emergency Banner */}
      <section className="container mx-auto px-4 pb-12 reveal">
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
            <Button
              variant="destructive"
              size="lg"
              onClick={() => window.open('tel:108')}
            >
              {language === 'hi' ? 'कॉल करें' : 'Call Now'}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
