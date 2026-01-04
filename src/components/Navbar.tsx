import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Heart,
  Lightbulb,
  Store,
  MessageCircle,
  Building,
  MapPin,
  User,
  ShoppingCart,
  Menu,
  Globe,
  LogOut,
  ChevronDown,
  Activity,
  Home as HomeIcon,
  Stethoscope,
  Pill,
  Bot,
  Hospital,
  ShoppingBag,
  Shield,
  Lock,
  Handshake,
  Zap,
  Settings,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');

  const navItems = [
    { path: '/symptoms', label: t.symptomTracker, icon: '🩺', color: 'text-rose-600' },
    { path: '/tips', label: t.healthTips, icon: '🌿', color: 'text-green-600' },
    { path: '/store', label: t.medicineStore, icon: '💊', color: 'text-amber-600' },
    { path: '/assistant', label: t.aiAssistant, icon: '🤖', color: 'text-blue-600' },
  ];

  const moreItems = [
    { path: '/', label: t.home, icon: '🏠', iconComponent: HomeIcon },
    { path: '/schemes', label: t.sarkariYojana, icon: '🏛️', iconComponent: Shield },
    { path: '/nearby', label: t.nearbyHospitals, icon: '🏥', iconComponent: Hospital },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languageFlags: Record<string, string> = {
    hi: '🇮🇳',
    en: '🇬🇧',
    bn: '🇧🇩',
    mr: '🇮🇳',
    bho: '🇮🇳',
    mai: '🇮🇳',
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top Header Row */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section + Express Delivery */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-7 h-7 text-white" fill="white" />
                </div>
                <span className="font-semibold text-xl text-gray-800 hidden sm:block">
                  {language === 'en' ? 'Swasthya Saathi' : t.appName}
                </span>
              </Link>

              {/* Express Delivery Section */}
              <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-amber-200">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Express delivery to</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-emerald-700 font-medium p-0 h-auto hover:bg-transparent text-xs sm:text-sm">
                      {selectedPincode}
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="border border-gray-200">
                    <DropdownMenuItem onClick={() => setSelectedPincode('110001')}>
                      110001 - New Delhi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('400001')}>
                      400001 - Mumbai
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('560001')}>
                      560001 - Bangalore
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('700001')}>
                      700001 - Kolkata
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Profile / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-gray-900">
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline">Hello, {user?.name?.split(' ')[0]}</span>
                      {!user?.name && <span className="hidden sm:inline">Hello</span>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border border-gray-200">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-3 py-2">
                        <User className="w-5 h-5" />
                        {t.myProfile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-3 py-2 text-red-600">
                      <LogOut className="w-5 h-5" />
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-gray-900">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Hello, Log in</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </Button>
                </Link>
              )}

              {/* Offers */}
              <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-gray-900 hidden sm:flex">
                <Settings className="w-5 h-5" />
                <span>Offers</span>
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-gray-900 relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.cart}</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-gray-700">
                    <Globe className="w-4 h-4" />
                    <span className="hidden md:inline">{languageNames[language]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-gray-200">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`gap-3 py-2 ${language === lang ? 'bg-emerald-50' : ''}`}
                    >
                      <span className="text-xl">{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                      </div>
                      {language === 'en' ? 'Swasthya Saathi' : t.appName}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    {navItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? 'default' : 'ghost'}
                          className="w-full justify-start gap-4 h-12 text-base"
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    {moreItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? 'default' : 'ghost'}
                          className="w-full justify-start gap-4 h-12 text-base"
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 h-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isActive(item.path) ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-gray-700 hover:text-emerald-600 font-medium h-auto p-0">
                  <span>⋯</span>
                  {language === 'hi' ? 'और' : 'More'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="border border-gray-200">
                {moreItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-3 py-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
