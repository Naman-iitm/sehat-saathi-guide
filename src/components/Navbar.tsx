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
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: t.home, icon: Home, iconComponent: HomeIcon, color: 'bg-primary' },
    { path: '/symptoms', label: t.symptomTracker, icon: Activity, iconComponent: Stethoscope, color: 'bg-rose-500' },
    { path: '/tips', label: t.healthTips, icon: Lightbulb, iconComponent: Lightbulb, color: 'bg-amber-500' },
    { path: '/store', label: t.medicineStore, icon: Store, iconComponent: Pill, color: 'bg-emerald-500' },
    { path: '/assistant', label: t.aiAssistant, icon: MessageCircle, iconComponent: Bot, color: 'bg-blue-500' },
    { path: '/schemes', label: t.sarkariYojana, icon: Building, iconComponent: Shield, color: 'bg-purple-500' },
    { path: '/nearby', label: t.nearbyHospitals, icon: MapPin, iconComponent: Hospital, color: 'bg-cyan-500' },
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
    <nav className="sticky top-0 z-40 w-full bg-card border-b-2 border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              {t.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 5).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  className={`gap-2 ${isActive(item.path) ? '' : 'hover:bg-secondary'}`}
                >
                  <item.iconComponent className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>⋯</span>
                  {language === 'hi' ? 'और' : 'More'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-2 border-border">
                {navItems.slice(5).map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-3 py-2">
                      <item.iconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-2">
                  <span className="text-lg">{languageFlags[language]}</span>
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{languageNames[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-2 border-border">
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

            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative border-2 gap-1">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-2">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-2 border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-3 py-2">
                      <User className="w-5 h-5" />
                      {t.myProfile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-3 py-2 text-destructive">
                    <LogOut className="w-5 h-5" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="gap-2">
                  <Lock className="w-5 h-5" />
                  {t.login}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm" className="border-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l-2 border-border">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {t.appName}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={isActive(item.path) ? 'default' : 'ghost'}
                        className="w-full justify-start gap-4 h-12 text-base"
                      >
                        <item.iconComponent className="w-6 h-6" />
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
    </nav>
  );
};

export default Navbar;
