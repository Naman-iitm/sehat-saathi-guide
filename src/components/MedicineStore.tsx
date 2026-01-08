import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { medicines, categories } from '@/data/medicines';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, ShoppingCart, Star, Tag, X } from 'lucide-react';


const MedicineStore: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); //auth check
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState<typeof medicines[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.nameHi.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'all' || medicine.category === selectedCategory;
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
    ? ` ${medicine.nameHi} कार्ट में जोड़ा गया!`
    : ` ${medicine.name} added to cart!`,
  {
    duration: 3000,
    position: 'bottom-right',
    className: 'toast-sparkle',
    
    action: {
      label: language === 'hi' ? 'कार्ट देखें' : 'View Cart',
      onClick: () => navigate('/cart'),
    },
    classNames: {
      toast: 'border-2 border-green-500 dark:border-green-400',
      title: 'text-sm font-medium',
      actionButton: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold',
    },
  }
);
  };

  const openMedicineModal = (medicine: typeof medicines[0]) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.medicineStore}
        </h1>
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
          className="pl-10 border-2 border-input h-12"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="border-2"
          >
            {language === 'hi' ? category.nameHi : category.name}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedicines.map((medicine) => (
          <Card
            key={medicine.id}
            className="border-2 border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
            onClick={() => openMedicineModal(medicine)}
          >
            <div className="relative aspect-square bg-muted">
              <img
                src={medicine.image}
                alt={language === 'hi' ? medicine.nameHi : medicine.name}
                className="w-full h-full object-cover"
              />
              {medicine.originalPrice > medicine.price && (
                <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                  <Tag className="w-3 h-3 mr-1" />
                  {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                {language === 'hi' ? medicine.nameHi : medicine.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {language === 'hi' ? medicine.descriptionHi : medicine.description}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-sm text-muted-foreground">{medicine.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-foreground">
                    ₹{medicine.price}
                  </span>
                  {medicine.originalPrice > medicine.price && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{medicine.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(medicine);
                  }}
                  className="gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {language === 'hi' ? 'जोड़ें' : 'Add'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {language === 'hi' ? 'कोई दवाई नहीं मिली' : 'No medicines found'}
          </p>
        </div>
      )}

      {/* Medicine Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedMedicine && (language === 'hi' ? selectedMedicine.nameHi : selectedMedicine.name)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMedicine && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedMedicine.image}
                    alt={language === 'hi' ? selectedMedicine.nameHi : selectedMedicine.name}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{language === 'hi' ? 'विवरण' : 'Description'}</h3>
                    <p className="text-muted-foreground">
                      {language === 'hi' ? selectedMedicine.descriptionHi : selectedMedicine.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{language === 'hi' ? 'मूल्य' : 'Price'}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground">₹{selectedMedicine.price}</span>
                        {selectedMedicine.originalPrice > selectedMedicine.price && (
                          <span className="text-muted-foreground line-through">₹{selectedMedicine.originalPrice}</span>
                        )}
                        {selectedMedicine.originalPrice > selectedMedicine.price && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            {Math.round(((selectedMedicine.originalPrice - selectedMedicine.price) / selectedMedicine.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{language === 'hi' ? 'रेटिंग' : 'Rating'}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-warning fill-current" />
                        <span className="font-medium">{selectedMedicine.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{language === 'hi' ? 'उपलब्धता' : 'Availability'}</h3>
                    <Badge variant={selectedMedicine.inStock ? 'default' : 'destructive'}>
                      {selectedMedicine.inStock 
                        ? (language === 'hi' ? 'स्टॉक में' : 'In Stock') 
                        : (language === 'hi' ? 'स्टॉक में नहीं' : 'Out of Stock')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{language === 'hi' ? 'श्रेणी' : 'Category'}</h3>
                  <p className="text-muted-foreground">
                    {categories.find(cat => cat.id === selectedMedicine.category)?.[language === 'hi' ? 'nameHi' : 'name']}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">{language === 'hi' ? 'आईडी' : 'ID'}</h3>
                  <p className="text-muted-foreground">{selectedMedicine.id}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    handleAddToCart(selectedMedicine);
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

export default MedicineStore;
