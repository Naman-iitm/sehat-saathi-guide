import React, { useState } from 'react';
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
import { Search, ShoppingCart, Star, Tag } from 'lucide-react';

const MedicineStore: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selectedMedicine, setSelectedMedicine] =
    useState<(typeof medicines)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);

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

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="pl-10 h-12"
        />
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
