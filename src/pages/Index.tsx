import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  const features = [
    {
      path: '/symptoms',
      label: t.symptomTracker,
      labelHi: 'लक्षण ट्रैकर',
      descHi: 'अपनी तकलीफ लिखें',
      descEn: 'Record your symptoms',
      color: 'bg-gradient-to-br from-rose-500 to-pink-600',
      iconComponent: Stethoscope,
    },
    {
      path: '/tips',
      label: t.healthTips,
      labelHi: 'स्वास्थ्य सुझाव',
      descHi: 'सरल स्वास्थ्य टिप्स',
      descEn: 'Simple health tips',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconComponent: Lightbulb,
    },
    {
      path: '/store',
      label: t.medicineStore,
      labelHi: 'दवाई दुकान',
      descHi: 'सस्ती दवाइयां खरीदें',
      descEn: 'Buy affordable medicines',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconComponent: Pill,
    },
    {
      path: '/assistant',
      label: t.aiAssistant,
      labelHi: 'AI सहायक',
      descHi: 'स्वास्थ्य मार्गदर्शन',
      descEn: 'Health guidance',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      iconComponent: Bot,
    },
    {
      path: '/schemes',
      label: t.sarkariYojana,
      labelHi: 'सरकारी योजना',
      descHi: 'मुफ्त स्वास्थ्य सेवाएं',
      descEn: 'Free health services',
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      iconComponent: ShieldIcon,
    },
    {
      path: '/nearby',
      label: t.nearbyHospitals,
      labelHi: 'नजदीकी अस्पताल',
      descHi: 'अस्पताल खोजें',
      descEn: 'Find hospitals',
      color: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      iconComponent: Hospital,
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
<section className="relative min-h-[90vh] flex items-center overflow-hidden text-white">
  {/* Background Video */}
{/* Background Video */}
<div className="absolute inset-0 z-0">
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

  {/* Soft white overlay */}
  <div className="absolute inset-0 bg-white/10" />

  {/* Light frosted blur */}
  <div className="absolute inset-0 backdrop-blur-[7px]" />
</div>


  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center">

      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm mb-6">
        <Shield className="w-4 h-4" />
        <span>
          {language === 'hi'
            ? 'विश्वसनीय डिजिटल स्वास्थ्य प्लेटफ़ॉर्म'
            : 'Trusted Digital Health Platform'}
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
        {t.appName}
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
        {language === 'hi'
          ? 'आपका स्वास्थ्य, हमारी प्राथमिकता — सरल, सुरक्षित और हर समय उपलब्ध'
          : 'Your health, our priority — simple, secure, and available anytime'}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
        <Button size="lg" className="gap-2 shadow-xl">
          <Activity className="w-5 h-5" />
          {language === 'hi' ? 'लक्षण जांचें' : 'Check Symptoms'}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="gap-2 bg-white text-primary hover:bg-white/90"
          onClick={() => setShowTutorial(true)}
        >
          <HelpCircle className="w-5 h-5" />
          {language === 'hi' ? 'ऐप कैसे काम करता है' : 'How it works'}
        </Button>
      </div>

      {/* Trust Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/15 backdrop-blur-md rounded-xl p-4 text-center"
          >
            <stat.icon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="text-sm text-white/80">
              {language === 'hi' ? stat.labelHi : stat.labelEn}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>




      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {language === 'hi' ? '🌟 हमारी सेवाएं' : '🌟 Our Services'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="border-2 hover:shadow-xl transition-all hover:-translate-y-1 h-full overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${feature.color} p-6 text-center`}>
                    <feature.iconComponent className="w-12 h-12 mx-auto text-white" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium mb-1">{feature.label}</h3>
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

      {/* Emergency */}
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
