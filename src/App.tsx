import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Index from "./pages/Index";
import SymptomTracker from '@/components/SymptomTracker';
import HealthTips from '@/components/HealthTips';
import MedicineStore from '@/components/MedicineStore';
import AIAssistant from '@/components/AIAssistant';
import MedicalHistoryPage from '@/pages/MedicalHistory';
import NearbyHospitals from '@/components/NearbyHospitals';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import EditProfile from '@/pages/EditProfile';
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Reminders from "@/pages/Reminders";
import VideoConsultation from '@/pages/VideoConsultation';
import Offers from "@/components/Offers";
import OfflineIndicator from "@/components/OfflineIndicator";
import GovernmentSchemes from '@/pages/GovernmentSchemes';

const queryClient = new QueryClient();

/* Scroll to top on route change */
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

/* Floating scroll button */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-primary/90 transition-all z-50"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTopOnRouteChange />
                  <div className="min-h-screen bg-background text-foreground">
                    <OfflineIndicator />
                    <Navbar />

                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/symptoms" element={<SymptomTracker />} />
                      <Route path="/tips" element={<HealthTips />} />
                      <Route path="/store" element={<MedicineStore />} />
                      <Route path="/assistant" element={<AIAssistant />} />
                      <Route path="/medical-history" element={<MedicalHistoryPage />} />
                      <Route path="/schemes" element={<GovernmentSchemes />} />
                      <Route path="/nearby" element={<NearbyHospitals />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/edit-profile" element={<EditProfile />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-and-conditions" element={<TermsConditions />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/consultation/:id" element={<VideoConsultation />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>

                    <Footer />
                    <ScrollToTopButton />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
