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

import SarkariYojana from '@/components/SarkariYojana';
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

const queryClient = new QueryClient();

// Component to scroll to top on route change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

// NEW: Floating Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 z-50"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

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
                  <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                    <OfflineIndicator />
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/symptoms" element={<SymptomTracker />} />
                      <Route path="/tips" element={<HealthTips />} />
                      <Route path="/store" element={<MedicineStore />} />
                      <Route path="/medical-history" element={<MedicalHistoryPage />} />

                      <Route path="/assistant" element={<AIAssistant />} />
                      <Route path="/schemes" element={<SarkariYojana />} />
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
                    {/* NEW: Add the floating scroll to top button */}
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