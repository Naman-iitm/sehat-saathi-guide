import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { medicines, categories } from '@/data/medicines';
import { genericComparison } from '@/data/genericComparison';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GenericComparisonModal from '@/components/GenericComparisonModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import { Search, ShoppingCart, Star, Tag, X, Clock, Package, ArrowUpDown } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name' | 'discount';

const MedicineStore: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const [selectedMedicine, setSelectedMedicine] =
    useState<(typeof medicines)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);
 

  // Sort options for dropdown
  const sortOptions = [
    { value: 'default', labelEn: 'Default', labelHi: 'डिफ़ॉल्ट' },
    { value: 'price-asc', labelEn: 'Price: Low to High', labelHi: 'कीमत: कम से अधिक' },
    { value: 'price-desc', labelEn: 'Price: High to Low', labelHi: 'कीमत: अधिक से कम' },
    { value: 'rating', labelEn: 'Rating: High to Low', labelHi: 'रेटिंग: अधिक से कम' },
    { value: 'name', labelEn: 'Name: A to Z', labelHi: 'नाम: A से Z' },
    { value: 'discount', labelEn: 'Discount: Highest First', labelHi: 'छूट: सबसे अधिक पहले' },
  ];

  // Load search history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('medicine-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (!query.trim() || query.length < 2) return;

    const trimmedQuery = query.trim();
    
    const updated = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, 5);

    setSearchHistory(updated);
    localStorage.setItem('medicine-search-history', JSON.stringify(updated));
  };

  // Remove item from history
  const removeFromHistory = (query: string) => {
    const updated = searchHistory.filter(item => item !== query);
    setSearchHistory(updated);
    localStorage.setItem('medicine-search-history', JSON.stringify(updated));
  };

  // Clear all history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('medicine-search-history');
    toast.success(
      language === 'hi'
        ? 'खोज इतिहास साफ़ हो गया'
        : 'Search history cleared'
    );
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle Enter key press
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      saveSearchToHistory(searchQuery);
      setShowHistory(false);
    }
  };

  // Apply search from history
  const applyHistorySearch = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  // Filter medicines
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.nameHi.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' ||
      medicine.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      
      case 'price-desc':
        return b.price - a.price;
      
      case 'rating':
        return b.rating - a.rating;
      
      case 'name':
        return a.name.localeCompare(b.name);
      
      case 'discount':
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discountB - discountA;
      
      default:
        return 0;
    }
  });

  const handleAddToCart = (medicine: typeof medicines[0]) => {
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
      id: medicine.id,
      name: medicine.name,
      nameHi: medicine.nameHi,
      price: medicine.price,
      image: medicine.image,
    });

    toast.success(
      language === 'hi'
        ? `${medicine.nameHi} कार्ट में जोड़ा गया`
        : `${medicine.name} added to cart`
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t.medicineStore}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {language === 'hi'
            ? 'सस्ती और अच्छी गुणवत्ता की दवाइयां'
            : 'Affordable quality medicines'}
        </p>
      </div>

      {/* Search with History */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleSearchSubmit}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          placeholder={t.search}
          className="pl-10 h-10 sm:h-12 text-sm sm:text-base search-input-focus transition-all"
        />

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-background border rounded-lg shadow-lg search-dropdown">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {language === 'hi' ? 'हाल की खोजें' : 'Recent Searches'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-6 text-xs hover:text-destructive transition-colors"
              >
                {language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
              </Button>
            </div>
            
            <div className="py-2">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer group search-history-item"
                  onClick={() => applyHistorySearch(item)}
                >
                  <span className="text-sm">{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Counter */}
      {searchQuery && (
        <div className="mb-4 flex items-center gap-2 result-counter">
          <Badge variant="secondary" className="text-sm">
            {language === 'hi'
              ? `${sortedMedicines.length} दवाइयां मिलीं`
              : `Found ${sortedMedicines.length} medicine${sortedMedicines.length !== 1 ? 's' : ''}`}
          </Badge>
          {sortedMedicines.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {language === 'hi'
                ? `"${searchQuery}" के लिए`
                : `for "${searchQuery}"`}
            </span>
          )}
        </div>
      )}

      {/* Categories and Sort */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={
                selectedCategory === category.id ? 'default' : 'outline'
              }
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap text-xs sm:text-sm py-2 h-auto transition-all hover:scale-105"
            >
              {language === 'hi' ? category.nameHi : category.name}
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={language === 'hi' ? 'क्रमबद्ध करें' : 'Sort by'} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {language === 'hi' ? option.labelHi : option.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

   
     
      {/* Empty State */}
      {sortedMedicines.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 empty-state">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {language === 'hi' ? 'कोई दवाई नहीं मिली' : 'No medicines found'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {language === 'hi'
              ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला। कृपया अलग खोजें या श्रेणी बदलें।`
              : `No results found for "${searchQuery}". Try a different search term or category.`}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            {language === 'hi' ? 'सभी दवाइयां देखें' : 'View All Medicines'}
          </Button>
        </div>
      )}

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {sortedMedicines.map((medicine) => (
          <Card
            key={medicine.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => {
              setSelectedMedicine(medicine);
              setIsModalOpen(true);
            }}
          >
            <div className="relative aspect-square bg-muted">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
              
              {medicine.originalPrice > medicine.price && (
                <Badge className="absolute top-2 right-2 bg-destructive">
                  <Tag className="w-3 h-3 mr-1" />
                  {Math.round(
                    ((medicine.originalPrice - medicine.price) /
                      medicine.originalPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </div>

            <CardContent className="p-2 sm:p-4">
              <h3 className="font-semibold mb-1 text-xs sm:text-sm line-clamp-2">
                {language === 'hi' ? medicine.nameHi : medicine.name}
              </h3>

              {genericComparison?.[medicine.name] && (
                <Badge className="mb-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                  Cheaper Generic Available
                </Badge>
              )}

              <p className="text-sm text-muted-foreground mb-2">
                {language === 'hi'
                  ? medicine.descriptionHi
                  : medicine.description}
              </p>

              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-current text-warning" />
                <span className="text-sm">{medicine.rating}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold">₹{medicine.price}</span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!genericComparison?.[medicine.name]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCompareData(
                        genericComparison?.[medicine.name]
                      );
                      setCompareOpen(true);
                    }}
                    className="transition-all hover:scale-105"
                  >
                    Compare
                  </Button>

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(medicine);
                    }}
                    className="transition-all hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generic Comparison Modal */}
      <GenericComparisonModal
        open={compareOpen}
        onClose={setCompareOpen}
        data={compareData}
      />

      {/* Medicine Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMedicine && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-4">
                  {language === 'hi'
                    ? selectedMedicine.nameHi
                    : selectedMedicine.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  <img
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                
                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === 'hi' ? 'विवरण' : 'Description'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'hi'
                        ? selectedMedicine.descriptionHi
                        : selectedMedicine.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-current text-warning" />
                    <span className="font-medium">{selectedMedicine.rating} Rating</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {language === 'hi' ? 'कैटेगरी' : 'Category'}: {language === 'hi' 
                        ? categories.find(c => c.id === selectedMedicine.category)?.nameHi 
                        : categories.find(c => c.id === selectedMedicine.category)?.name}
                    </Badge>
                    <Badge variant="outline">
                      {selectedMedicine.inStock 
                        ? (language === 'hi' ? 'स्टॉक में' : 'In Stock') 
                        : (language === 'hi' ? 'स्टॉक में नहीं' : 'Out of Stock')}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    ₹{selectedMedicine.price}
                    {selectedMedicine.originalPrice > selectedMedicine.price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ₹{selectedMedicine.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {genericComparison?.[selectedMedicine.name] && (
                    <Badge className="bg-green-500 text-white">
                      {language === 'hi' 
                        ? 'सस्ता जेनेरिक उपलब्ध' 
                        : 'Cheaper Generic Available'}
                    </Badge>
                  )}
                  
                  {/* Expandable Medicine Details */}
                  <div className="space-y-2 pt-2">
                    <details className="group">
                      <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                        {language === 'hi' ? 'उपयोग निर्देश' : 'Usage Instructions'}
                        <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? `सामान्य रूप से डॉक्टर की सलाह पर लें। सामान्य खुराक: ${selectedMedicine.name.includes('Paracetamol') ? '500mg, 3 बार दिन में' : selectedMedicine.name.includes('ORS') ? 'एक बूंद दिन में 3 बार' : 'जैसा डॉक्टर निर्धारित करे'}`
                          : `Generally take as per doctor's advice. Typical dosage: ${selectedMedicine.name.includes('Paracetamol') ? '500mg, 3 times a day' : selectedMedicine.name.includes('ORS') ? 'One sachet dissolved in water, 3 times a day' : 'As prescribed by doctor'}`}
                      </div>
                    </details>
                    
                    <details className="group">
                      <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                        {language === 'hi' ? 'सावधानियां' : 'Precautions'}
                        <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? 'खाली पेट लेने से बचें, यदि गर्भवती हों तो डॉक्टर से परामर्श करें।'
                          : 'Avoid on empty stomach, consult doctor if pregnant.'}
                      </div>
                    </details>
                    
                    <details className="group">
                      <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                        {language === 'hi' ? 'साइड इफेक्ट्स' : 'Side Effects'}
                        <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? 'मतली, चक्कर, त्वचा पर लाल चकत्ते।'
                          : 'Nausea, dizziness, skin rashes.'}
                      </div>
                    </details>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        handleAddToCart(selectedMedicine);
                        setIsModalOpen(false);
                      }}
                    >
                      {language === 'hi' ? 'खरीदें' : 'Buy Now'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex-1"
                      disabled={!genericComparison?.[selectedMedicine.name]}
                      onClick={() => {
                        setCompareData(genericComparison?.[selectedMedicine.name]);
                        setCompareOpen(true);
                        setIsModalOpen(false);
                      }}
                    >
                      {language === 'hi' ? 'तुलना करें' : 'Compare'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicineStore;