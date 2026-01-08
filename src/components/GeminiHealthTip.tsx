import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiHealthTip {
  title: string;
  description: string;
}

// Get API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''; // You'll need to add your API key in a .env file
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const GeminiHealthTip: React.FC = () => {
  const { language } = useLanguage();
  const [tip, setTip] = useState<GeminiHealthTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get cached tip for today and language
  const getCachedTip = (): GeminiHealthTip | null => {
    const cachedData = localStorage.getItem('gemini_health_tip');
    if (!cachedData) return null;

    try {
      const { tip, date, lang } = JSON.parse(cachedData);
      const today = new Date().toDateString();
      
      // Return cached tip if it's from today AND same language
      if (date === today && lang === language) {
        return tip;
      }
    } catch (e) {
      console.error('Error parsing cached tip:', e);
    }

    return null;
  };

  // Function to cache the tip with today's date and language
  const cacheTip = (tip: GeminiHealthTip) => {
    const today = new Date().toDateString();
    const cacheData = {
      tip,
      date: today,
      lang: language
    };
    localStorage.setItem('gemini_health_tip', JSON.stringify(cacheData));
  };

  // Function to fetch health tip from Gemini API
  const fetchHealthTip = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have a cached tip for today
      const cachedTip = getCachedTip();
      if (cachedTip) {
        setTip(cachedTip);
        setLoading(false);
        return;
      }

      // Prepare prompt based on language
      const prompt = language === 'hi' 
        ? "एक दिन में एक बार दिखाने के लिए एक नया, ज्ञानवर्धक और जुड़ाव वाला स्वास्थ्य सुझाव उपलब्ध कराएं। केवल एक शीर्षक और विवरण दें। उत्तर को हिंदी में प्रारूप में वापस करें: {\"title\": \"शीर्षक\", \"description\": \"विवरण\"}" 
        : "Provide a new, informative, and engaging health tip to be shown once per day. Only provide a title and description. Return the response in JSON format: {\"title\": \"title\", \"description\": \"description\"}";

      // Call the Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[^}]+\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const tipData = JSON.parse(jsonMatch[0]);
      setTip(tipData);
      cacheTip(tipData);
    } catch (err) {
      console.error('Error fetching health tip:', err);
      
      // Fallback to a default tip if API call fails
      const fallbackTip = language === 'hi' ? {
        title: "पानी पीना जारी रखें",
        description: "अच्छे स्वास्थ्य बनाए रखने और शरीर को ठीक ढंग से काम करने में मदद करने के लिए रोजाना कम से कम 8 गिलास पानी पिएं।"
      } : {
        title: "Stay Hydrated",
        description: "Drink at least 8 glasses of water daily to maintain good health and help your body function optimally."
      };
      setTip(fallbackTip);
      cacheTip(fallbackTip);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthTip();

    // Refresh tip every 24 hours
    const interval = setInterval(fetchHealthTip, 24 * 60 * 60 * 1000); // 24 hours
    return () => clearInterval(interval);
  }, [language]);

  // Refresh tip when language changes
  useEffect(() => {
    fetchHealthTip();
  }, [language]);

  if (loading) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 min-h-[200px]">
        <CardHeader className="bg-green-100 pb-4">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <Lightbulb className="w-10 h-10 animate-pulse" />
            <span className="text-lg">
              {language === 'hi' ? 'आज का स्वास्थ्य सुझाव' : 'Today\'s Health Tip'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground italic flex items-center gap-2">
            <span className="animate-spin">🌀</span>
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive bg-gradient-to-br from-green-50 to-emerald-50 min-h-[200px]">
        <CardHeader className="bg-green-100 pb-4">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <Lightbulb className="w-10 h-10" />
            <span className="text-lg">
              {language === 'hi' ? 'स्वास्थ्य सुझाव' : 'Health Tip'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-destructive">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 min-h-[200px]">
      <CardHeader className="bg-green-100 pb-4">
        <CardTitle className="flex items-center gap-3 text-green-800">
          <Lightbulb className="w-10 h-10" />
          <span className="text-lg">
            {language === 'hi' ? 'आज का स्वास्थ्य सुझाव' : 'Today\'s Health Tip'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-xl mb-2 text-green-700">{tip?.title}</h3>
        <p className="text-green-600 leading-relaxed">
          {tip?.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default GeminiHealthTip;