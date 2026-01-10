import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Gift, Bell, Heart, Pill, Stethoscope } from 'lucide-react';

interface NewsItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
  discount?: string;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    titleHi: '🎉 विशेष छूट!',
    titleEn: '🎉 Special Offer!',
    descriptionHi: 'सभी विटामिन पर 30% की छूट। सीमित समय के लिए!',
    descriptionEn: '30% OFF on all vitamins. Limited time offer!',
    icon: <Gift className="w-6 h-6" />,
    color: 'bg-primary',
    discount: '30% OFF',
  },
  {
    id: '2',
    titleHi: '💊 आयुष्मान भारत अपडेट',
    titleEn: '💊 Ayushman Bharat Update',
    descriptionHi: 'नई दवाइयां आयुष्मान भारत में शामिल। अभी चेक करें!',
    descriptionEn: 'New medicines added to Ayushman Bharat. Check now!',
    icon: <Pill className="w-6 h-6" />,
    color: 'bg-primary',
  },
  {
    id: '3',
    titleHi: '🏥 मुफ्त स्वास्थ्य जांच',
    titleEn: '🏥 Free Health Checkup',
    descriptionHi: 'PHC में मुफ्त स्वास्थ्य जांच शिविर। इस रविवार!',
    descriptionEn: 'Free health checkup camp at PHC. This Sunday!',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'bg-primary',
  },
];

const HealthNewsPopup: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('newsPopupDismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('newsPopupDismissed', 'true');
  };

  const news = newsItems[currentNews];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border-4 border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={`${news.color} p-4 text-primary-foreground relative`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              {news.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {language === 'hi' ? news.titleHi : news.titleEn}
              </h3>
              {news.discount && (
                <span className="inline-block bg-primary-foreground text-primary text-sm font-bold px-2 py-0.5 rounded mt-1">
                  {news.discount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-foreground text-lg mb-6">
            {language === 'hi' ? news.descriptionHi : news.descriptionEn}
          </p>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentNews(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentNews ? 'bg-primary scale-125' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2"
            >
              {language === 'hi' ? 'बाद में' : 'Later'}
            </Button>
            <Button
              onClick={handleClose}
              className="flex-1 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {language === 'hi' ? 'अभी देखें' : 'View Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthNewsPopup;
