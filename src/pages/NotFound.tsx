import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, ArrowLeft, Search, AlertTriangle, Heart, Navigation, Stethoscope, Shield } from 'lucide-react';
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { path: '/symptoms', label: language === 'hi' ? 'लक्षण जांच' : 'Symptom Checker', icon: <Stethoscope className="w-5 h-5" /> },
    { path: '/store', label: language === 'hi' ? 'दवा की दुकान' : 'Medicine Store', icon: <Heart className="w-5 h-5" /> },
    { path: '/tips', label: language === 'hi' ? 'स्वास्थ्य सलाह' : 'Health Tips', icon: <Shield className="w-5 h-5" /> },
    { path: '/assistant', label: language === 'hi' ? 'AI सहायक' : 'AI Assistant', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main 404 Card */}
        <Card className="border-2 border-dashed border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 pb-6 pt-8 px-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-500 dark:text-red-400" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {language === 'hi' ? 'पेज नहीं मिला' : 'Page Not Found'}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {language === 'hi' 
                ? 'ओह! लगता है आप गलत रास्ते पर आ गए हैं।' 
                : 'Oops! It looks like you\'ve taken a wrong turn.'}
            </CardDescription>
            <div className="mt-3">
              <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                {location.pathname}
              </code>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 pb-8 px-4 md:px-6">
            <div className="space-y-6">
              {/* Message Section */}
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  {language === 'hi' 
                    ? 'आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है।' 
                    : 'The page you are looking for doesn\'t exist or has been moved.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' 
                    ? 'चिंता न करें, हम आपको स्वस्थ रास्ते पर वापस ले आएंगे!' 
                    : 'Don\'t worry, we\'ll get you back on the healthy track!'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGoHome}
                  className="h-11 px-6 text-base font-medium shadow-md hover:shadow-lg transition-all group"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  {language === 'hi' ? 'होम पेज पर जाएं' : 'Go to Homepage'}
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="h-11 px-6 text-base font-medium shadow-sm hover:shadow transition-all group"
                  size="lg"
                >
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground">
                    {language === 'hi' ? 'या इनमें से कोई एक देखें' : 'Or explore one of these'}
                  </span>
                </div>
              </div>

              {/* Quick Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => navigate(link.path)}
                    className="h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-center">{link.label}</span>
                  </Button>
                ))}
              </div>

              {/* Health Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-800 border border-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold">
                    {language === 'hi' ? 'स्वास्थ्य सलाह' : 'Health Tip'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' 
                    ? 'यदि आप बेहतर महसूस नहीं कर रहे हैं, तो हमारे लक्षण जांचकर्ता का उपयोग करें या तुरंत डॉक्टर से परामर्श लें।' 
                    : 'If you\'re not feeling well, use our symptom checker or consult a doctor immediately.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help Section */}
        <Card className="border border-border shadow-sm mt-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {language === 'hi' ? 'अभी भी मदद की ज़रूरत है?' : 'Still need help?'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'hi' 
                      ? 'हमारे समर्थन टीम से संपर्क करें' 
                      : 'Contact our support team'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-sm">
                {language === 'hi' ? 'सहायता प्राप्त करें' : 'Get Help'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;