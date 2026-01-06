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
  Heart,
  Lightbulb,
  Store,
  MessageCircle,
  MapPin,
  User,
  ShoppingCart,
  Menu,
  Globe,
  LogOut,
  ChevronDown,
  Activity,
  Zap,
  Settings,
  Moon,
  Sun,
  Shield,
  Hospital,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages, currentLanguageName } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');

  const navItems = [
    { path: '/', label: t.home, icon: '🏠' },
    { path: '/symptoms', label: t.symptomTracker, icon: '🩺' },
    { path: '/tips', label: t.healthTips, icon: '🌿' },
    { path: '/store', label: t.medicineStore, icon: '💊' },
    { path: '/assistant', label: t.aiAssistant, icon: '🤖' },
  ];

  const moreItems = [
    { path: '/schemes', label: t.sarkariYojana, icon: '🏛️' },
    { path: '/nearby', label: t.nearbyHospitals, icon: '🏥' },
    { path: '/reminders', label: 'Reminders', icon: '⏰' },
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
    <nav className="sticky top-0 z-50 w-full bg-background shadow-sm dark:shadow-gray-800 transition-colors duration-300">
      {/* Top Header Row */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section + Express Delivery */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground hidden sm:block tracking-tight text-primary">
                  {language === 'en' ? 'Sehat Saathi' : t.appName}
                </span>
              </Link>

              {/* Express Delivery Section */}
              <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-full border border-border">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Delivery to</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary font-bold p-0 h-auto hover:bg-transparent text-xs">
                      {selectedPincode}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSelectedPincode('110001')}>110001 - New Delhi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('400001')}>400001 - Mumbai</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('560001')}>560001 - Bangalore</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Profile / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="hidden sm:inline font-medium">Hi, {user?.name?.split(' ')[0]}</span>
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
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Log in</span>
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="gap-2 text-foreground relative h-10 w-10 p-0 sm:w-auto sm:px-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.cart}</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Dark Mode Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground h-10 px-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden md:inline">{currentLanguageName}</span>
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
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
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
                    {[...navItems, ...moreItems].map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-4 h-12 text-base"
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    {!isAuthenticated && (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full mt-4">Log In / Sign Up</Button>
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
      <div className="hidden lg:block bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 h-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary border-b-2 border-primary h-12 pt-0.5' : 'text-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-primary font-medium h-auto p-0">
                  <span>⋯</span>
                  {language === 'hi' ? 'और' : 'More'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {moreItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-3 py-2 cursor-pointer">
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
