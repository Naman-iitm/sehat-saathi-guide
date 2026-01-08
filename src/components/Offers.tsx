import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { offers, offerCategories } from '@/data/offers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Search,
    ShoppingCart,
    Clock,
    Tag,
    Sparkles,
    Gift,
    Percent,
    Calendar,
    AlertCircle,
    Timer,
    ChevronRight,
    Star,
    Zap,
    Package,
} from 'lucide-react';

// Helper function to calculate time remaining
const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
};

// Countdown Timer Component
const CountdownTimer: React.FC<{ endDate: Date; language: string }> = ({ endDate, language }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeRemaining(endDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (timeLeft.expired) {
        return (
            <div className="flex items-center gap-1 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'समाप्त' : 'Expired'}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4 text-amber-500" />
            <div className="flex gap-1">
                {timeLeft.days > 0 && (
                    <span className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded font-mono text-amber-700 dark:text-amber-300">
                        {timeLeft.days}d
                    </span>
                )}
                <span className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded font-mono text-amber-700 dark:text-amber-300">
                    {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded font-mono text-amber-700 dark:text-amber-300">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded font-mono text-amber-700 dark:text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
            </div>
        </div>
    );
};

// Skeleton Loader
const OfferCardSkeleton: React.FC = () => (
    <Card className="border-2 border-border overflow-hidden">
        <Skeleton className="aspect-video" />
        <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-28" />
            </div>
        </CardContent>
    </Card>
);

const Offers: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'all' | 'limited' | 'seasonal' | 'firstTime' | 'bundle'>('all');

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter offers based on search and category
    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.titleHi.includes(searchQuery) ||
            offer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.productNameHi.includes(searchQuery);

        const matchesCategory =
            selectedCategory === 'all' || offer.category === selectedCategory;

        const matchesSection =
            activeSection === 'all' ||
            (activeSection === 'limited' && offer.isLimitedTime) ||
            (activeSection === 'seasonal' && offer.isSeasonal) ||
            (activeSection === 'firstTime' && offer.isFirstTimeUser) ||
            (activeSection === 'bundle' && offer.category === 'bundle');

        return matchesSearch && matchesCategory && matchesSection;
    });

    // Get special sections
    const limitedTimeOffers = offers.filter(o => o.isLimitedTime);
    const seasonalOffers = offers.filter(o => o.isSeasonal);
    const firstTimeOffers = offers.filter(o => o.isFirstTimeUser);
    const bundleOffers = offers.filter(o => o.category === 'bundle');

    const handleAddToCart = (offer: typeof offers[0]) => {
        if (!isAuthenticated) {
            toast.error(
                language === 'hi'
                    ? 'कार्ट में जोड़ने के लिए कृपया लॉगिन करें'
                    : 'Please login to add items to cart'
            );
            navigate('/auth');
            return;
        }
        addToCart({
            id: offer.id,
            name: offer.productName,
            nameHi: offer.productNameHi,
            price: offer.discountedPrice,
            image: offer.image,
        });
        toast.success(
            language === 'hi'
                ? `${offer.productNameHi} कार्ट में जोड़ा गया`
                : `${offer.productName} added to cart`
        );
    };

    const openOfferModal = (offer: typeof offers[0]) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const sectionButtons = [
        { id: 'all' as const, label: language === 'hi' ? 'सभी ऑफर' : 'All Offers', icon: Tag, count: offers.length },
        { id: 'limited' as const, label: language === 'hi' ? 'सीमित समय' : 'Limited Time', icon: Timer, count: limitedTimeOffers.length },
        { id: 'seasonal' as const, label: language === 'hi' ? 'मौसमी ऑफर' : 'Seasonal', icon: Sparkles, count: seasonalOffers.length },
        { id: 'firstTime' as const, label: language === 'hi' ? 'नए उपयोगकर्ता' : 'First Time', icon: Gift, count: firstTimeOffers.length },
        { id: 'bundle' as const, label: language === 'hi' ? 'बंडल ऑफर' : 'Bundles', icon: Package, count: bundleOffers.length },
    ];

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Hero Section */}
            <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Percent className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {language === 'hi' ? 'ऑफर और डील्स' : 'Offers & Deals'}
                            </h1>
                            <p className="text-white/80 text-lg">
                                {language === 'hi'
                                    ? 'दवाइयों और स्वास्थ्य उत्पादों पर बेहतरीन छूट पाएं'
                                    : 'Get amazing discounts on medicines & healthcare products'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Zap className="w-5 h-5 text-yellow-300" />
                            <span>{language === 'hi' ? 'तुरंत बचत' : 'Instant Savings'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Star className="w-5 h-5 text-yellow-300" />
                            <span>{language === 'hi' ? '100% प्रामाणिक' : '100% Authentic'}</span>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-4 right-12 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" />
            </div>

            {/* Search & Section Tabs */}
            <div className="space-y-4 mb-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'hi' ? 'ऑफर खोजें...' : 'Search offers...'}
                        className="pl-10 border-2 border-input h-12"
                        aria-label={language === 'hi' ? 'ऑफर खोजें' : 'Search offers'}
                    />
                </div>

                {/* Section Tabs */}
                <div className="flex flex-wrap gap-2">
                    {sectionButtons.map((section) => (
                        <Button
                            key={section.id}
                            variant={activeSection === section.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveSection(section.id)}
                            className="gap-2 border-2"
                            aria-pressed={activeSection === section.id}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {section.count}
                            </Badge>
                        </Button>
                    ))}
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {offerCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className="border border-border"
                        >
                            {language === 'hi' ? category.nameHi : category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <OfferCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Offers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredOffers.map((offer) => (
                            <Card
                                key={offer.id}
                                className="group border-2 border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card"
                                onClick={() => openOfferModal(offer)}
                                tabIndex={0}
                                role="button"
                                aria-label={`${language === 'hi' ? offer.titleHi : offer.title} - ${offer.discountPercentage}% off`}
                                onKeyDown={(e) => e.key === 'Enter' && openOfferModal(offer)}
                            >
                                {/* Image with Badges */}
                                <div className="relative aspect-video bg-muted overflow-hidden">
                                    <img
                                        src={offer.image}
                                        alt={language === 'hi' ? offer.productNameHi : offer.productName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Discount Badge */}
                                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-lg px-3 py-1 font-bold shadow-lg">
                                        <Tag className="w-4 h-4 mr-1" />
                                        {offer.discountPercentage}% OFF
                                    </Badge>

                                    {/* Special tags */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        {offer.isLimitedTime && (
                                            <Badge className="bg-amber-500 text-white shadow-lg">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {language === 'hi' ? 'सीमित' : 'Limited'}
                                            </Badge>
                                        )}
                                        {offer.isFirstTimeUser && (
                                            <Badge className="bg-purple-500 text-white shadow-lg">
                                                <Gift className="w-3 h-3 mr-1" />
                                                {language === 'hi' ? 'नए उपयोगकर्ता' : 'New User'}
                                            </Badge>
                                        )}
                                        {offer.isSeasonal && offer.seasonalTag && (
                                            <Badge className="bg-cyan-500 text-white shadow-lg">
                                                {offer.seasonalTag}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <CardContent className="p-4 space-y-3">
                                    {/* Title */}
                                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                        {language === 'hi' ? offer.titleHi : offer.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {language === 'hi' ? offer.descriptionHi : offer.description}
                                    </p>

                                    {/* Countdown Timer for Limited Time Offers */}
                                    {offer.isLimitedTime && (
                                        <CountdownTimer endDate={offer.validUntil} language={language} />
                                    )}

                                    {/* Price Section */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <span className="text-2xl font-bold text-emerald-600">
                                                ₹{offer.discountedPrice}
                                            </span>
                                            <span className="text-sm text-muted-foreground line-through ml-2">
                                                ₹{offer.originalPrice}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(offer);
                                            }}
                                            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {language === 'hi' ? 'जोड़ें' : 'Add'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredOffers.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                                <Tag className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                {language === 'hi' ? 'कोई ऑफर नहीं मिला' : 'No Offers Found'}
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {language === 'hi'
                                    ? 'इस समय इस श्रेणी में कोई ऑफर उपलब्ध नहीं है। कृपया बाद में देखें।'
                                    : "No offers available in this category at the moment. Please check back later."}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setActiveSection('all');
                                }}
                            >
                                {language === 'hi' ? 'सभी ऑफर देखें' : 'View All Offers'}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Offer Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-emerald-500" />
                            {selectedOffer && (language === 'hi' ? selectedOffer.titleHi : selectedOffer.title)}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOffer && (language === 'hi' ? selectedOffer.descriptionHi : selectedOffer.description)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOffer && (
                        <div className="space-y-6">
                            {/* Image */}
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={selectedOffer.image}
                                    alt={language === 'hi' ? selectedOffer.productNameHi : selectedOffer.productName}
                                    className="w-full h-64 object-contain bg-muted"
                                />
                                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xl px-4 py-2 font-bold">
                                    {selectedOffer.discountPercentage}% OFF
                                </Badge>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        {language === 'hi' ? 'उत्पाद' : 'Product'}
                                    </h3>
                                    <p className="text-foreground font-medium text-xl">
                                        {language === 'hi' ? selectedOffer.productNameHi : selectedOffer.productName}
                                    </p>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'hi' ? 'मूल कीमत' : 'Original Price'}
                                        </p>
                                        <p className="text-lg line-through text-muted-foreground">
                                            ₹{selectedOffer.originalPrice}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'hi' ? 'ऑफर कीमत' : 'Offer Price'}
                                        </p>
                                        <p className="text-2xl font-bold text-emerald-600">
                                            ₹{selectedOffer.discountedPrice}
                                        </p>
                                    </div>
                                    <Badge className="ml-auto bg-emerald-600 text-white text-lg px-4 py-2">
                                        {language === 'hi' ? 'बचत' : 'Save'} ₹{selectedOffer.originalPrice - selectedOffer.discountedPrice}
                                    </Badge>
                                </div>

                                {/* Validity */}
                                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'hi' ? 'वैधता' : 'Valid Until'}
                                        </p>
                                        <p className="font-medium">
                                            {selectedOffer.validUntil.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {selectedOffer.isLimitedTime && (
                                        <div className="ml-auto">
                                            <CountdownTimer endDate={selectedOffer.validUntil} language={language} />
                                        </div>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'hi' ? selectedOffer.termsAndConditionsHi : selectedOffer.termsAndConditions}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => {
                                        handleAddToCart(selectedOffer);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {language === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {language === 'hi' ? 'बंद करें' : 'Close'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Offers;
