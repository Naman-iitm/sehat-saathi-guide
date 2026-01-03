import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppTutorial from '@/components/AppTutorial';
import HealthNewsPopup from '@/components/HealthNewsPopup';
import AIAssistantPopup from '@/components/AIAssistantPopup';
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
} from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const heroCards = [
    {
      icon: Activity,
      titleHi: 'लक्षण ट्रैकिंग',
      titleEn: 'Symptom Tracking',
      messageHi: 'अपने लक्षणों को ट्रैक करें और व्यक्तिगत स्वास्थ्य सलाह प्राप्त करें',
      messageEn: 'Track your symptoms and get personalized health advice',
      color: 'bg-primary',
    },
    {
      icon: Heart,
      titleHi: 'स्वास्थ्य निगरानी',
      titleEn: 'Health Monitoring',
      messageHi: '24/7 अपने स्वास्थ्य की निगरानी करें और समय पर सहायता पाएं',
      messageEn: 'Monitor your health 24/7 and get timely assistance',
      color: 'bg-accent',
    },
    {
      icon: MessageCircle,
      titleHi: 'AI सहायता',
      titleEn: 'AI Support',
      messageHi: 'स्मार्ट AI सहायक से तुरंत स्वास्थ्य मार्गदर्शन प्राप्त करें',
      messageEn: 'Get instant health guidance from smart AI assistant',
      color: 'bg-primary',
    },
    {
      icon: Shield,
      titleHi: 'सुरक्षित देखभाल',
      titleEn: 'Secure Care',
      messageHi: 'आपका डेटा पूरी तरह सुरक्षित और गोपनीय है',
      messageEn: 'Your data is completely secure and confidential',
      color: 'bg-accent',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % heroCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const features = [
    {
      path: '/symptoms',
      icon: Activity,
      label: t.symptomTracker,
      labelHi: 'लक्षण ट्रैकर',
      descHi: 'अपनी तकलीफ लिखें',
      descEn: 'Record your symptoms',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/5',
    },
    {
      path: '/tips',
      icon: Lightbulb,
      label: t.healthTips,
      labelHi: 'स्वास्थ्य सुझाव',
      descHi: 'सरल स्वास्थ्य टिप्स',
      descEn: 'Simple health tips',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/5',
    },
    {
      path: '/store',
      icon: Store,
      label: t.medicineStore,
      labelHi: 'दवाई दुकान',
      descHi: 'सस्ती दवाइयां खरीदें',
      descEn: 'Buy affordable medicines',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/5',
    },
    {
      path: '/assistant',
      icon: MessageCircle,
      label: t.aiAssistant,
      labelHi: 'AI सहायक',
      descHi: 'स्वास्थ्य मार्गदर्शन',
      descEn: 'Health guidance',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/5',
    },
    {
      path: '/schemes',
      icon: Building,
      label: t.sarkariYojana,
      labelHi: 'सरकारी योजना',
      descHi: 'मुफ्त स्वास्थ्य सेवाएं',
      descEn: 'Free health services',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/5',
    },
    {
      path: '/nearby',
      icon: MapPin,
      label: t.nearbyHospitals,
      labelHi: 'नजदीकी अस्पताल',
      descHi: 'अस्पताल खोजें',
      descEn: 'Find hospitals',
      iconColor: 'text-accent',
      bgColor: 'bg-accent/5',
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
      <AIAssistantPopup />

      {/* Hero Section - Modern Split Layout */}
      <section className="bg-white border-b border-border min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                {language === 'hi' 
                  ? 'आपका स्वास्थ्य, हमारी प्राथमिकता' 
                  : 'Your health, our priority'}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {language === 'hi'
                  ? 'व्यापक स्वास्थ्य सेवाओं तक आसान पहुंच। लक्षण ट्रैकिंग से लेकर AI सहायता तक।'
                  : 'Easy access to comprehensive healthcare services. From symptom tracking to AI assistance.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="gap-2 text-lg font-medium"
                  asChild
                >
                  <Link to="/symptoms">
                    <Activity className="w-5 h-5" />
                    {language === 'hi' ? 'लक्षण ट्रैक करें' : 'Track Symptoms'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-lg font-medium border-2"
                  onClick={() => setShowTutorial(true)}
                >
                  <HelpCircle className="w-5 h-5" />
                  {language === 'hi' ? 'कैसे काम करता है' : 'How it works'}
                </Button>
              </div>
            </div>
            
            {/* Right Visual - Interactive Cards */}
            <div className="relative">
              {/* Main Display Card */}
              <div className="relative bg-gradient-to-br from-secondary/50 to-primary/10 rounded-3xl p-8 md:p-12 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-6 animate-fade-in">
                  <div className={`w-20 h-20 ${heroCards[activeCard].color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    {React.createElement(heroCards[activeCard].icon, {
                      className: 'w-10 h-10 text-white',
                    })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-3">
                      {language === 'hi' ? heroCards[activeCard].titleHi : heroCards[activeCard].titleEn}
                    </h3>
                    <p className="text-muted-foreground text-xl leading-relaxed max-w-md mx-auto">
                      {language === 'hi' ? heroCards[activeCard].messageHi : heroCards[activeCard].messageEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Navigation */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {heroCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCard(index)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      activeCard === index
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center mx-auto`}>
                      {React.createElement(card.icon, {
                        className: 'w-4 h-4 text-white',
                      })}
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2 justify-center mt-4">
                {heroCards.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeCard === index ? 'w-8 bg-primary' : 'w-4 bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl mb-2">
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-base md:text-lg text-muted-foreground font-medium">
                  {language === 'hi' ? stat.labelHi : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'आपकी स्वास्थ्य आवश्यकताओं के लिए व्यापक समाधान'
                : 'Comprehensive solutions for your healthcare needs'}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Link key={feature.path} to={feature.path}>
                <Card className="border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full group">
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === 'hi' ? feature.descHi : feature.descEn}
                      </p>
                    </div>
                    <div className="flex items-center text-primary font-medium text-sm pt-2">
                      {language === 'hi' ? 'और जानें' : 'Learn more'}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tip Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <Card className="border border-border bg-white max-w-5xl mx-auto shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-2xl text-foreground">
                    {language === 'hi' ? 'आज का स्वास्थ्य सुझाव' : 'Daily Health Tip'}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {language === 'hi'
                      ? 'दिन में कम से कम 8 गिलास पानी पिएं। यह शरीर को स्वस्थ और हाइड्रेटेड रखता है।'
                      : 'Drink at least 8 glasses of water daily. It keeps your body healthy and hydrated.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="bg-white py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-destructive max-w-5xl mx-auto shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-destructive/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl md:text-2xl text-destructive">
                      {language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Assistance'}
                    </h4>
                    <p className="text-foreground font-mono text-3xl md:text-4xl font-bold">108 / 112</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="lg"
                  className="font-semibold text-lg px-8 py-6"
                  onClick={() => window.open('tel:108')}
                >
                  {language === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
