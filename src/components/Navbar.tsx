
import React, { useState } from 'react';
import { Bell, FlaskConical } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
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
  Building,
  ChevronDown,
  Zap,
  Moon,
  Sun,
  MapPin,
  Activity,
  Lightbulb,
  Store,
  MessageCircle,
  Home,
  FileText
} from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');
  const [pincodeOpen, setPincodeOpen] = useState(false);

  // Determine dark mode state for toggle logic
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/', label: t.home, icon: Home },
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard', icon: Activity }] : []),
    { path: '/symptoms', label: t.symptomTracker, icon: Activity },
    { path: '/tips', label: t.healthTips, icon: Lightbulb },
    { path: '/store', label: t.medicineStore, icon: Store },
    { path: '/assistant', label: t.aiAssistant, icon: MessageCircle },
    { path: '/schemes', label: t.schemes, icon: Building },
    { path: '/nearby', label: t.nearbyHospitals, icon: MapPin },
    { path: '/reminders', label: 'Reminders', icon: '⏰' },
    { path: '/medical-history', label: 'Medical History', icon: FileText },
    { path: '/lab-tests', label: 'Lab Tests', icon: FlaskConical },
    { path: '/help', label: 'Help Center', icon: Lightbulb },

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
    <nav className="sticky top-0 z-50 w-full bg-background shadow-sm dark:shadow-gray-800 transition-colors duration-300 border-b border-border">
      {/* Top Header Row */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo + Express Delivery */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/" className="flex items-center gap-1 sm:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="font-semibold text-xs sm:text-base md:text-xl text-foreground whitespace-nowrap hidden min-[400px]:block">
                  {language === 'en' ? 'Swasthya Saathi' : t.appName}
                </span>
              </Link>

              {/* Express Delivery (Desktop/Tablet) */}
              <div className="hidden md:flex items-center gap-1 sm:gap-2 bg-secondary/50 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border border-border text-xs sm:text-sm whitespace-nowrap ml-4">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                <span className="hidden sm:inline text-muted-foreground">Express delivery to</span>
                <DropdownMenu open={pincodeOpen} onOpenChange={setPincodeOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto hover:bg-transparent font-medium"
                    >
                      {selectedPincode}
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSelectedPincode('110001')}>110001 - New Delhi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('400001')}>400001 - Mumbai</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('560001')}>560001 - Bangalore</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPincode('700001')}>700001 - Kolkata</DropdownMenuItem>
                    <DropdownMenuItem>Detect my location</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 px-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden lg:inline">{languageNames[language]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`gap-3 py-2 cursor-pointer ${language === lang ? 'bg-secondary' : ''}`}
                    >
                      <span className="text-lg">{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark Mode */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="flex" /*"hidden sm:flex" to flex done.#248*/
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </Button>


              {/* Notifications */}
              {isAuthenticated && <NotificationBell />}

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Profile/Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer gap-2">
                        <User className="w-4 h-4" /> {t.myProfile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer gap-2">
                        <Activity className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer gap-2">
                      <LogOut className="w-4 h-4" /> {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="hidden sm:flex">Log In</Button>
                </Link>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="border-b pb-4 mb-4 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-lg font-bold">
                        {language === 'en' ? 'Swasthya Saathi' : t.appName}
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
                    {isAuthenticated && (
                      <div className="flex items-center gap-3 p-3 mb-2 bg-secondary/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                    )}

                    {navItems.map((item) => {
                      const Icon = typeof item.icon === 'string' ? Activity : item.icon;
                      const isStrIcon = typeof item.icon === 'string';

                      return (
                        <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                          <Button
                            variant={isActive(item.path) ? 'secondary' : 'ghost'}
                            className={`w-full justify-start gap-4 h-11 ${isActive(item.path) ? 'font-semibold' : ''}`}
                          >
                            {isStrIcon ? (
                              <span className="text-lg">{item.icon as string}</span>
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}

                    <div className="my-2 border-t border-border"></div>

                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4"
                      onClick={toggleTheme}
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </Button>

                    {!isAuthenticated ? (
                      <Link to="/auth" onClick={() => setIsOpen(false)} className="mt-4">
                        <Button className="w-full">Log In / Sign Up</Button>
                      </Link>
                    ) : (
                      <Button variant="destructive" className="w-full justify-start gap-4 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2" onClick={() => { logout(); setIsOpen(false); }}>
                        <LogOut className="w-5 h-5" />
                        {t.logout}
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation (Bottom Row) */}
      <div className="hidden lg:block bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 h-12 overflow-hidden">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = typeof item.icon === 'string' ? Activity : item.icon;
              const isStrIcon = typeof item.icon === 'string';

              return (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  <Button
                    variant="ghost"
                    className={`gap-1 rounded-full px-3 h-8 text-sm ${active ? 'bg-secondary text-primary hover:bg-secondary/80' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {isStrIcon
                      ? <span>{item.icon as string}</span>
                      : <Icon className="w-3.5 h-3.5" />
                    }
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
