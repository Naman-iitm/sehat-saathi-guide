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
import GenericComparisonModal from '@/components/GenericComparisonModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import { Search, ShoppingCart, Star, Tag, X, Clock } from 'lucide-react';

const MedicineStore: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [selectedMedicine, setSelectedMedicine] =
    useState<(typeof medicines)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);

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
    
    // Remove duplicate if exists, add to front (most recent first)
    const updated = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, 5); // Keep only 5 most recent

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
    // Don't save to history on every keystroke
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

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.nameHi.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' ||
      medicine.category === selectedCategory;

    return matchesSearch && matchesCategory;
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.medicineStore}</h1>
        <p className="text-muted-foreground">
          {language === 'hi'
            ? 'सस्ती और अच्छी गुणवत्ता की दवाइयां'
            : 'Affordable quality medicines'}
        </p>
      </div>

      {/* Search with History */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        onKeyDown={handleSearchSubmit}
        onFocus={() => setShowHistory(true)}
        onBlur={() => setTimeout(() => setShowHistory(false), 200)}
        placeholder={t.search}
        className="pl-10 h-12"
      />

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-background border rounded-lg shadow-lg">
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
                className="h-6 text-xs"
              >
                {language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
              </Button>
            </div>
            
            <div className="py-2">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer group"
                  onClick={() => applyHistorySearch(item)}
                >
                  <span className="text-sm">{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
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

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={
              selectedCategory === category.id ? 'default' : 'outline'
            }
            onClick={() => setSelectedCategory(category.id)}
          >
            {language === 'hi' ? category.nameHi : category.name}
          </Button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMedicines.map((medicine) => (
          <Card
            key={medicine.id}
            className="cursor-pointer hover:shadow-lg"
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

            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">
                {language === 'hi' ? medicine.nameHi : medicine.name}
              </h3>

              {genericComparison?.[medicine.name] && (
                <Badge className="mb-2 bg-green-100 text-green-700">
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
                  >
                    Compare
                  </Button>

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(medicine);
                    }}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMedicine &&
                (language === 'hi'
                  ? selectedMedicine.nameHi
                  : selectedMedicine.name)}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicineStore;