import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppTutorial from '@/components/AppTutorial';
import HealthNewsPopup from '@/components/HealthNewsPopup';
import {
  Heart,
  Activity,
  Lightbulb,
  Store,
  MessageCircle,
  Building,
  MapPin,
  HelpCircle,
  Sparkles,
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
} from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);

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

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      path: '/store',
      icon: Store,
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
      icon: Activity,
      label: language === 'hi' ? 'लैब टेस्ट' : 'Lab Tests',
      labelHi: 'लैब टेस्ट',
      descHi: '70% तक छूट',
      descEn: 'UPTO 70% OFF',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconComponent: Stethoscope,
    },
    {
      path: '/assistant',
      icon: MessageCircle,
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
      icon: Store,
      label: language === 'hi' ? 'ब्रांडेड विकल्प' : 'Branded Substitute',
      labelHi: 'ब्रांडेड विकल्प',
      descHi: '50% तक बचत',
      descEn: 'UPTO 50% OFF',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      iconComponent: Zap,
    },
    {
      path: '/tips',
      icon: Lightbulb,
      label: language === 'hi' ? 'हेल्थकेयर' : 'Healthcare',
      labelHi: 'हेल्थकेयर',
      descHi: '60% तक छूट',
      descEn: 'UPTO 60% OFF',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      iconComponent: Heart,
    },
    {
      path: '/tips',
      icon: Lightbulb,
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
      icon: Building,
      label: 'PLUS',
      labelHi: 'PLUS',
      descHi: '5% अतिरिक्त बचत',
      descEn: 'SAVE 5% EXTRA',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      iconComponent: Sparkles,
    },
    {
      path: '/store',
      icon: Store,
      label: language === 'hi' ? 'ऑफर' : 'Offers',
      labelHi: 'ऑफर',
      descHi: 'सर्वश्रेष्ठ डील',
      descEn: 'BEST DEALS',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      iconComponent: Tag,
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', labelHi: 'उपयोगकर्ता', labelEn: 'Users' },
    { icon: Shield, value: '100%', labelHi: 'सुरक्षित', labelEn: 'Secure' },
    { icon: Clock, value: '24/7', labelHi: 'उपलब्ध', labelEn: 'Available' },
  ];

  return (
    <div className="min-h-screen">
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
        
        <div className="container mx-auto text-center relative z-10">
          <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-12 h-12 animate-float" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.appName}</h1>
          <p className="text-xl opacity-90 max-w-md mx-auto mb-8">
            {language === 'hi' ? 'आपका स्वास्थ्य, हमारी प्राथमिकता' : 'Your health, our priority'}
          </p>
          
          <Button
            onClick={() => setShowTutorial(true)}
            variant="secondary"
            size="lg"
            className="gap-2 shadow-lg"
          >
            <HelpCircle className="w-5 h-5" />
            {language === 'hi' ? 'ऐप कैसे इस्तेमाल करें?' : 'How to use this app?'}
          </Button>
        </div>

        {/* Stats */}
        <div className="container mx-auto mt-12">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-primary-foreground/10 rounded-xl p-4">
                <stat.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">
                  {language === 'hi' ? stat.labelHi : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
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
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={language === 'hi' ? 'दवाइयां, अस्पताल या लक्षण खोजें...' : 'Search for medicines, hospitals, or symptoms...'}
                    className="w-full pl-10 pr-24 md:pr-32 py-6 md:py-7 bg-muted/50 border-2 border-border rounded-xl focus-visible:ring-primary text-sm md:text-base"
                  />
                  <Button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 md:px-8 h-9 md:h-11 text-xs md:text-sm">
                    {language === 'hi' ? 'खोजें' : 'Search'}
                  </Button>
                </div>
                
                {/* Category Quick Links */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {['Medicine', 'Healthcare', 'Lab Tests', 'Doctor Consult', 'Offers'].map((cat) => (
                    <button key={cat} className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-4 md:p-6 border border-primary/10 flex flex-row lg:flex-col items-center justify-between lg:justify-center text-center lg:min-w-[240px] gap-4">
                <div className="flex items-center lg:flex-col gap-3 lg:gap-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center lg:mb-3">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground lg:mb-2">
                    {language === 'hi' ? 'पर्चे के साथ ऑर्डर करें' : 'Order with prescription'}
                  </p>
                </div>
                <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                  {language === 'hi' ? 'अभी अपलोड करें' : 'UPLOAD NOW'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Horizontal Scroll */}
      <section className="container mx-auto px-4 py-12 reveal">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'hi' ? '🌟 हमारी सेवाएं' : '🌟 Our Services'}
          </h2>
        </div>
        
        <div className="overflow-hidden -mx-4 px-4 md:mx-0 md:px-0 pt-6">
          <div className="animate-marquee flex gap-6">
            {[...features, ...features].map((feature, index) => (
              <Link key={index} to={feature.path} className="flex-shrink-0 w-[140px] group">
                <div className="flex flex-col items-center text-center">
                  <div className={`${feature.color} w-24 h-24 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                    <feature.iconComponent className={`w-10 h-10 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">{feature.label}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${feature.iconColor}`}>
                    {language === 'hi' ? feature.descHi : feature.descEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips Banner */}
      <section className="container mx-auto px-4 pb-12 reveal">
        <Card className="border-2 border-border bg-gradient-to-r from-secondary to-muted overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <Lightbulb className="w-14 h-14 text-foreground" />
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">
                {language === 'hi' ? 'आज का स्वास्थ्य सुझाव' : 'Today\'s Health Tip'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'hi'
                  ? 'दिन में कम से कम 8 गिलास पानी पिएं। यह शरीर को स्वस्थ रखता है।'
                  : 'Drink at least 8 glasses of water daily. It keeps your body healthy.'}
              </p>
            </div>
            <Droplets className="w-12 h-12 hidden md:block text-foreground" />
          </CardContent>
        </Card>
      </section>

      {/* Emergency Banner */}
      <section className="container mx-auto px-4 pb-12 reveal">
        <Card className="border-2 border-destructive bg-destructive/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <h4 className="font-bold text-destructive">
                  {language === 'hi' ? 'आपातकालीन नंबर' : 'Emergency Number'}
                </h4>
                <p className="text-foreground font-mono text-xl">108 / 112</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="lg"
              className="gap-2"
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
