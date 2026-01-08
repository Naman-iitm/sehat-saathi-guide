import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  Home as HomeIcon,
  Heart,
  User,
  ShoppingCart,
  Menu,
  Globe,
  LogOut,
  Building,
  ChevronDown,
  Zap,
  Shield,
  Hospital,
  Settings,
  Moon,
  Sun,
  MapPin,
  Activity,
  Lightbulb,
  Store,
  MessageCircle
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const [pincodeOpen, setPincodeOpen] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');

  const navItems = [
    { path: '/', label: t.home, icon: HomeIcon },
    { path: '/symptoms', label: t.symptomTracker, icon: Activity },
    { path: '/tips', label: t.healthTips, icon: Lightbulb },
    { path: '/store', label: t.medicineStore, icon: Store },
    { path: '/assistant', label: t.aiAssistant, icon: MessageCircle },
    { path: '/schemes', label: t.schemes, icon: Building },
    { path: '/nearby', label: t.nearbyHospitals, icon: MapPin },
    { path: '/reminders', label: 'Reminders', icon: Activity },
  ];

  const moreItems = [
    { path: '/', label: t.home, icon: HomeIcon },
    { path: '/schemes', label: t.sarkariYojana, icon: Shield },
    { path: '/nearby', label: t.nearbyHospitals, icon: Hospital },
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
    <nav className="sticky top-0 z-40 w-full bg-background shadow-sm dark:shadow-gray-800 transition-colors duration-300">
      {/* Top Header Row */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Express Delivery */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="white" />
                </div>
                <span className="font-semibold text-base sm:text-xl text-foreground whitespace-nowrap">
                  {language === 'en' ? 'Swasthya Saathi' : t.appName}
                </span>
              </Link>

              {/* Express Delivery */}
              <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 dark:bg-amber-950 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border border-amber-200 dark:border-amber-800 text-xs sm:text-sm whitespace-nowrap">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                <span className="hidden sm:inline text-muted-foreground">Express delivery to</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto hover:bg-transparent"
                    >
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
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {/* Profile/Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground/80 whitespace-nowrap">
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline">Hello, {user?.name?.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border border-border">
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
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground/80 whitespace-nowrap">
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
              <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground/80 hidden sm:flex whitespace-nowrap">
                <Settings className="w-5 h-5" />
                <span>Offers</span>
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground/80 relative whitespace-nowrap">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.cart}</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Dark Mode */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-foreground hover:text-foreground/80 whitespace-nowrap"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Language Selector */}
              <div className="hidden sm:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-foreground whitespace-nowrap">
                      <Globe className="w-4 h-4" />
                      <span className="hidden md:inline">{languageNames[language]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border border-border">
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`gap-3 py-2 ${language === lang ? 'bg-emerald-50 dark:bg-emerald-950' : ''}`}
                      >
                        <span className="text-xl">{languageFlags[lang]}</span>
                        <span>{languageNames[lang]}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 max-w-full overflow-y-auto p-4">
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
                          className="w-full justify-start gap-4 h-12 text-base whitespace-nowrap"
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    {/* Dark Mode Toggle */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 h-12 text-base whitespace-nowrap"
                      onClick={toggleTheme}
                    >
                      <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-background border-b border-border overflow-x-auto">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 md:gap-8 h-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                isActive(item.path) ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
              } whitespace-nowrap`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-medium h-auto p-0"
              >
                <span>⋯</span>
                {language === 'hi' ? 'और' : 'More'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="border border-border">
              {moreItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link to={item.path} className="flex items-center gap-3 py-2 whitespace-nowrap">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;