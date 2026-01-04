import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  MapPin,
  User,
  ShoppingCart,
  ChevronDown,
  Home,
  Activity,
  Lightbulb,
  Store,
  MessageCircle,
  Menu,
  LogOut,
  Building,
  Globe,
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { t, language, setLanguage, languageNames, availableLanguages, currentLanguageName } = useLanguage();
  const [pincodeOpen, setPincodeOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: t.home, icon: Home },
    { path: '/symptoms', label: t.symptomTracker, icon: Activity },
    { path: '/tips', label: t.healthTips, icon: Lightbulb },
    { path: '/store', label: t.medicineStore, icon: Store },
    { path: '/assistant', label: t.aiAssistant, icon: MessageCircle },
    { path: '/schemes', label: t.schemes, icon: Building },
    { path: '/nearby', label: t.nearbyHospitals, icon: MapPin },
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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border">
      {/* TOP BAR: Utility & Branding */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto flex items-center justify-between px-4 h-12 text-sm">
          {/* LEFT: Branding & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
                {language === 'en' ? 'Swasthya Saathi' : t.appName}
              </span>
            </Link>

            <div className="hidden md:flex items-center h-4 w-px bg-border"></div>

            <DropdownMenu open={pincodeOpen} onOpenChange={setPincodeOpen}>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>Select Location</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Detect my location</DropdownMenuItem>
                <DropdownMenuItem>Enter Pincode</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* RIGHT: User Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <ModeToggle />

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary h-8 px-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden md:inline">{currentLanguageName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-border">
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`gap-3 py-2 cursor-pointer ${language === lang ? 'bg-secondary' : ''}`}
                  >
                    <span className="text-xl">{languageFlags[lang]}</span>
                    <span>{languageNames[lang]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Offers Link */}
            <Link to="/offers" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-primary font-medium transition-colors">
              <span className="text-lg">🏷️</span>
              <span>Offers</span>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      {t.myProfile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Log in</span>
              </Link>
            )}

            <Link to="/cart" className="relative group flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">{t.cart}</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background ring-1 ring-primary">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden ml-2">
                <Button variant="ghost" size="icon" className="-mr-2 text-muted-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="border-b pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        {language === 'en' ? 'Swasthya Saathi' : t.appName}
                      </span>
                    </SheetTitle>
                    <ModeToggle />
                  </div>
                </SheetHeader>
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={isActive(item.path) ? 'secondary' : 'ghost'}
                        className={`w-full justify-start gap-3 h-11 transition-all ${isActive(item.path) ? 'bg-secondary text-primary hover:bg-secondary/80' : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                          }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`} />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <div className="my-2 border-t border-border"></div>
                  {!isAuthenticated && (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full mt-2">
                        Log In / Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* PRIMARY NAVIGATION (Desktop) */}
      <div className="hidden lg:block bg-background py-3">
        <nav className="container mx-auto flex items-center justify-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`relative h-10 px-4 rounded-full transition-all duration-200 hover:bg-secondary 
                        ${active
                      ? 'text-primary font-semibold bg-secondary hover:bg-secondary/80'
                      : 'text-muted-foreground hover:text-primary'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${active ? 'fill-current' : ''}`} />
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
