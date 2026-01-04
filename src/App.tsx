import { evaluateSymptoms } from "./lib/triage";
import { useState, useEffect } from 'react';
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
import SarkariYojana from '@/components/SarkariYojana';
import NearbyHospitals from '@/components/NearbyHospitals';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  // 🔽 TEMPORARY TEST (safe place)
  const test = evaluateSymptoms({
    symptoms: ["chest pain", "shortness of breath"]
  });

  console.log("Triage test:", test);
  // 🔼 TEMPORARY TEST

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/symptoms" element={<SymptomTracker />} />
                    <Route path="/tips" element={<HealthTips />} />
                    <Route path="/store" element={<MedicineStore />} />
                    <Route path="/assistant" element={<AIAssistant />} />
                    <Route path="/schemes" element={<SarkariYojana />} />
                    <Route path="/nearby" element={<NearbyHospitals />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
