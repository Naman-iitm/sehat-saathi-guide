import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { healthTips } from '@/data/healthTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Toilet,
  Droplets,
  Utensils,
  Moon,
  Wind,
  User,
  Bug,
  Syringe,
  Hand,
  Carrot,
  PersonStanding,
  GlassWater,
  Apple,
  Ban,
  Brush,
  Shield,
  SmartphoneNfc,
  AlertTriangle,
  HeartPulse,
  Smile,

  // 🔽 REQUIRED for new tips
  Clock,
  Eye,
  PauseCircle,
  Shoe,
  Pill,
  Users,
  Sun,
  BriefcaseMedical,
  MoonStar,
  Stethoscope,
  Cup,
} from 'lucide-react';

// Mapping icon names to actual icon components
const iconMap: Record<string, React.FC<any>> = {
  soap: Hand,
  droplets: Droplets,
  salad: Utensils,
  pot: Utensils,
  plate: Carrot,
  moon: Moon,
  toilet: Toilet,
  window: Wind,
  walk: User,
  activity: PersonStanding,
  bug: Bug,
  syringe: Syringe,

  // existing
  'glass-water': GlassWater,
  apple: Apple,
  ban: Ban,
  broom: Brush,
  shield: Shield,
  smartphone: SmartphoneNfc,
  'alert-triangle': AlertTriangle,
  'heart-pulse': HeartPulse,
  smile: Smile,
  mask: Shield,
  wind: Wind,

  // 🔽 NEW (for added guidelines)
  'person-standing': PersonStanding,
  clock: Clock,
  eye: Eye,
  'pause-circle': PauseCircle,
  shoe: Shoe,
  pill: Pill,
  users: Users,
  sun: Sun,
  'briefcase-medical': BriefcaseMedical,
  'moon-star': MoonStar,
  stethoscope: Stethoscope,
  cup: Cup,
};

const HealthTips: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.healthTipsTitle}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi'
            ? 'सरल और प्रभावी स्वास्थ्य सुझाव'
            : 'Simple and effective health tips'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthTips.map((tip) => (
          <Card
            key={tip.id}
            className="border-2 border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <CardHeader className="bg-secondary pb-4">
              <CardTitle className="flex items-center gap-3 text-secondary-foreground">
                {iconMap[tip.icon]
                  ? React.createElement(iconMap[tip.icon], { className: 'w-10 h-10' })
                  : <span className="text-4xl">{tip.icon}</span>}
                <span className="text-lg">
                  {language === 'hi' ? tip.titleHi : tip.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground leading-relaxed">
                {language === 'hi' ? tip.descriptionHi : tip.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;
