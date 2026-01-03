import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Heart,
  Activity,
  Lightbulb,
  Store,
  MessageCircle,
  Building,
  MapPin,
  Globe,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';

interface TutorialStep {
  icon: React.ReactNode;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  color: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    icon: <Heart className="w-12 h-12" />,
    titleHi: 'स्वास्थ्य साथी में आपका स्वागत है!',
    titleEn: 'Welcome to Swasthya Saathi!',
    descriptionHi: 'यह ऐप आपके स्वास्थ्य की देखभाल के लिए बनाया गया है। आइए जानते हैं इसे कैसे इस्तेमाल करें।',
    descriptionEn: 'This app is designed to take care of your health. Let\'s learn how to use it.',
    color: 'bg-primary',
  },
  {
    icon: <Activity className="w-12 h-12" />,
    titleHi: 'लक्षण ट्रैकर',
    titleEn: 'Symptom Tracker',
    descriptionHi: 'यहां आप अपनी तकलीफें लिख सकते हैं। तारीख और समय अपने आप दर्ज हो जाता है। डॉक्टर को दिखाते समय यह मदद करता है।',
    descriptionEn: 'Here you can record your symptoms. Date and time are automatically saved. This helps when visiting the doctor.',
    color: 'bg-primary',
  },
  {
    icon: <MessageCircle className="w-12 h-12" />,
    titleHi: 'AI सहायक',
    titleEn: 'AI Assistant',
    descriptionHi: 'अपनी तकलीफ के बारे में बातचीत करें। यह बताएगा कि घर पर आराम करें या डॉक्टर को दिखाएं।',
    descriptionEn: 'Talk about your health problem. It will guide whether to rest at home or see a doctor.',
    color: 'bg-primary',
  },
  {
    icon: <Store className="w-12 h-12" />,
    titleHi: 'दवाई दुकान',
    titleEn: 'Medicine Store',
    descriptionHi: 'सस्ती और अच्छी दवाइयां खरीदें। खोजें, कार्ट में डालें, और ऑर्डर करें। कैश ऑन डिलीवरी उपलब्ध है।',
    descriptionEn: 'Buy affordable quality medicines. Search, add to cart, and order. Cash on Delivery available.',
    color: 'bg-primary',
  },
  {
    icon: <Building className="w-12 h-12" />,
    titleHi: 'सरकारी योजनाएं',
    titleEn: 'Government Schemes',
    descriptionHi: 'आयुष्मान भारत जैसी मुफ्त स्वास्थ्य योजनाओं की जानकारी पाएं। देखें कि आप पात्र हैं या नहीं।',
    descriptionEn: 'Get information about free health schemes like Ayushman Bharat. Check if you are eligible.',
    color: 'bg-primary',
  },
  {
    icon: <MapPin className="w-12 h-12" />,
    titleHi: 'नजदीकी अस्पताल',
    titleEn: 'Nearby Hospitals',
    descriptionHi: 'अपने पास के अस्पताल और क्लिनिक खोजें। सीधे कॉल करें या रास्ता देखें।',
    descriptionEn: 'Find hospitals and clinics near you. Call directly or get directions.',
    color: 'bg-primary',
  },
  {
    icon: <Globe className="w-12 h-12" />,
    titleHi: 'भाषा बदलें',
    titleEn: 'Change Language',
    descriptionHi: 'ऊपर भाषा बटन से अपनी पसंद की भाषा चुनें - हिंदी, अंग्रेजी, बंगाली, मराठी, भोजपुरी, या मैथिली।',
    descriptionEn: 'Select your preferred language from the language button above - Hindi, English, Bengali, Marathi, Bhojpuri, or Maithili.',
    color: 'bg-primary',
  },
];

interface AppTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppTutorial: React.FC<AppTutorialProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const step = tutorialSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('tutorialCompleted', 'true');
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-4 border-border">
        <div className={`${step.color} p-8 text-primary-foreground text-center`}>
          <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            {step.icon}
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary-foreground">
              {language === 'hi' ? step.titleHi : step.titleEn}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <p className="text-foreground text-center mb-6 leading-relaxed">
            {language === 'hi' ? step.descriptionHi : step.descriptionEn}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary scale-125'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirst && (
              <Button variant="outline" onClick={handlePrev} className="gap-2 border-2">
                <ChevronLeft className="w-4 h-4" />
                {language === 'hi' ? 'पीछे' : 'Back'}
              </Button>
            )}
            {isFirst && (
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                {language === 'hi' ? 'छोड़ें' : 'Skip'}
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 gap-2">
              {isLast ? (
                <>
                  <Check className="w-4 h-4" />
                  {language === 'hi' ? 'शुरू करें' : 'Get Started'}
                </>
              ) : (
                <>
                  {language === 'hi' ? 'आगे' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppTutorial;
