import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/theme-provider';

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
  Heart,
  User,
  ShoppingCart,
  Menu,
  Globe,
  LogOut,
  ChevronDown,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [customRegion, setCustomRegion] = useState('');
  const [showRegionInput, setShowRegionInput] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [showServiceTip, setShowServiceTip] = useState(false);
  const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');

  const navItems = [
    { path: "/", label: t.home || 'Home', icon: "🏠" },
    { path: "/symptoms", label: t.symptomTracker, icon: "🩺" },
    { path: "/tips", label: t.healthTips, icon: "🌿" },
    { path: "/store", label: t.medicineStore, icon: "💊" },
    { path: "/assistant", label: t.aiAssistant, icon: "🤖" },
  ];

  const moreItems = [
    { path: '/schemes', label: t.sarkariYojana, icon: '🏛️' },
    { path: '/nearby', label: t.nearbyHospitals, icon: '🏥' },
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
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm dark:shadow-gray-800 transition-colors duration-300">
      {/* Top Header Row */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section + Express Delivery */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-primary hidden sm:block tracking-tight">
                  {language === 'en' ? 'Sehat Saathi' : t.appName}
                </span>
              </Link>

              {/* Express Delivery Section */}
              <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 dark:bg-amber-950 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Express delivery to</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-emerald-700 font-medium p-0 h-auto hover:bg-transparent text-xs sm:text-sm">
                      {selectedPincode}
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="border border-gray-200">
                    <DropdownMenuItem
                        onClick={() => {
                          setSelectedPincode('110001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        110001 - New Delhi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                          setSelectedPincode('120001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        120001 - Mumbai
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                          setSelectedPincode('130001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        130001 - Bangalore
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                          setSelectedPincode('140001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        140001 - Kolkata
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                          setSelectedPincode('150001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        150001 - Pune
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                          setSelectedPincode('160001');
                          setIsOtherSelected(false);
                          setShowServiceTip(false);
                        }}
                      >
                        160001 - chennai
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                          setIsOtherSelected(true);
                          setShowRegionInput(true);
                          setShowServiceTip(false);
                        }}
                      >
                        Other
                      </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {showRegionInput && (
              <div className="px-3 py-2 border-t space-y-2">
                <input
                  type="text"
                  placeholder="Enter your region / pincode"
                  value={customRegion}
                  onChange={(e) => setCustomRegion(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (!customRegion.trim()) return;

                      setSelectedPincode(customRegion);
                      setShowServiceTip(true);
                      setShowRegionInput(false);
                    }}
                  >
                    OK
                  </Button>
              </div>
            )}
            {isOtherSelected && showServiceTip && (
              <p className="text-xs text-amber-600 mt-1">
                🚧 Soon service will be available in your region
              </p>
            )}


            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Profile / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-foreground h-10">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="hidden sm:inline font-medium text-xs">Hi, {user?.name?.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 py-2">
                        <User className="w-4 h-4" />
                        {t.myProfile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2 py-2 text-destructive">
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground h-10 px-3">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">{t.login}</span>
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 p-0 text-foreground">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} className="h-10 w-10">
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground h-10 px-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden md:inline text-xs font-medium">{currentLanguageName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`gap-3 py-2 ${language === lang ? 'bg-secondary' : ''}`}
                    >
                      <span className="text-xl">{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-primary">
                        {language === 'en' ? 'Sehat Saathi' : t.appName}
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    {navItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-4 h-12 text-base font-medium"
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    <div className="my-2 border-t border-border" />
                    {moreItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-4 h-12 text-base font-medium"
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    {!isAuthenticated && (
                      <Link to="/auth" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full mt-4 h-12 text-base font-bold bg-primary hover:bg-primary/90">
                          {t.login} / Sign Up
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row (Desktop) */}
      <div className="hidden lg:block bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 h-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:text-primary relative group h-12 ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary font-semibold h-12 p-0 flex items-center">
                  <span>⋯</span>
                  <span className="text-sm">{language === 'hi' ? 'और' : 'More'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {moreItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-3 py-3 cursor-pointer">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
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
