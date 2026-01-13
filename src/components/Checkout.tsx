import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CheckCircle2, Truck, CreditCard } from 'lucide-react';

const Checkout: React.FC = () => {
  const { t, language } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Helper function to generate a random tracking number
  const generateTrackingNumber = (): string => {
    return `TRK-${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
  };
  
  // Helper function to calculate estimated delivery date (3-7 days from now)
  const calculateEstimatedDelivery = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3); // 3-7 days from now
    return date.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error(
        language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields'
      );
      return;
    }

    setIsSubmitting(true);
    
    if (!user) {
      toast.error(language === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      navigate('/auth');
      return;
    }
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Create order in user's order history
    try {
      const ordersKey = `user_orders_${user.id}`;
      const existingOrders = localStorage.getItem(ordersKey);
      let orders = existingOrders ? JSON.parse(existingOrders) : [];
      
      // Convert cart items to order items
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        nameHi: item.nameHi,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));
      
      // Generate a new order ID
      const orderId = `#ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${(orders.length + 1).toString().padStart(3, '0')}`;
      
      // Create new order
      const newOrder = {
        id: Date.now().toString(),
        orderId: orderId,
        date: new Date().toISOString().split('T')[0],
        items: orderItems,
        totalAmount: total,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        estimatedDelivery: calculateEstimatedDelivery(),
        trackingNumber: generateTrackingNumber(),
        status: 'processing' as 'processing',
        statusHistory: [
          {
            id: Date.now().toString(),
            date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            status: 'processing' as 'processing',
            statusHi: 'प्रसंस्करण',
            statusEn: 'Processing'
          }
        ]
      };
      
      // Add new order to the beginning of the list
      orders.unshift(newOrder);
      
      // Save updated orders to localStorage
      localStorage.setItem(ordersKey, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error(language === 'hi' ? 'ऑर्डर सहेजने में त्रुटि' : 'Error saving order');
    }
    
    setOrderPlaced(true);
    clearCart();
    toast.success(t.orderSuccess);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto border-2 border-border text-center">
          <CardContent className="py-12">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t.orderSuccess}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'hi'
                ? 'आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है। जल्द ही डिलीवर किया जाएगा।'
                : 'Your order has been placed successfully. It will be delivered soon.'}
            </p>
            <Button onClick={() => navigate('/order-tracking')} className="gap-2">
              {language === 'hi' ? 'डिलीवरी स्टेटस ट्रैक करें' : 'Track Delivery Status'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t.checkout}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Section */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-secondary">
                <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                  <Truck className="w-5 h-5" />
                  {t.address}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">{t.fullName}</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      className="border-2 border-input mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="border-2 border-input mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">{t.streetAddress}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="border-2 border-input mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t.city}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="border-2 border-input mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">{t.pincode}</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, pincode: e.target.value }))
                      }
                      className="border-2 border-input mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="border-2 border-border">
              <CardHeader className="bg-secondary">
                <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                  <CreditCard className="w-5 h-5" />
                  {t.paymentMethod}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: value }))
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">{t.cod}</span>
                      <span className="block text-sm text-muted-foreground">
                        {language === 'hi'
                          ? 'डिलीवरी पर नकद भुगतान'
                          : 'Pay cash when delivered'}
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <span className="font-medium">{t.upi}</span>
                      <span className="block text-sm text-muted-foreground">
                        {language === 'hi'
                          ? 'UPI से भुगतान करें'
                          : 'Pay using UPI'}
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? language === 'hi'
                  ? 'प्रोसेस हो रहा है...'
                  : 'Processing...'
                : t.placeOrder}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-2 border-border sticky top-24">
            <CardHeader className="bg-secondary">
              <CardTitle className="text-secondary-foreground">
                {language === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === 'hi' ? item.nameHi : item.name} x {item.quantity}
                    </span>
                    <span className="text-foreground">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-border pt-4">
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>{t.total}</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
