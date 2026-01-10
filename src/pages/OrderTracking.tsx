import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Define types for order tracking
interface OrderItem {
  id: string;
  name: string;
  nameHi: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderStatus {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  statusHi: string;
  statusEn: string;
}

interface Order {
  id: string;
  orderId: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  estimatedDelivery: string;
  trackingNumber: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  statusHistory: OrderStatus[];
}

// Function to generate a random tracking number
const generateTrackingNumber = (): string => {
  return `TRK-${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
};

// Function to get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Function to generate a random estimated delivery date (3-7 days from now)
const generateEstimatedDelivery = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3); // 3-7 days from now
  return date.toISOString().split('T')[0];
};

// Function to initialize default orders in localStorage if not present
const initializeDefaultOrders = (userId: string) => {
  const ordersKey = `user_orders_${userId}`;
  const existingOrders = localStorage.getItem(ordersKey);
  
  if (!existingOrders || JSON.parse(existingOrders).length === 0) {
    const defaultOrders: Order[] = [
      {
        id: Date.now().toString(),
        orderId: `#ORD-${getCurrentDate().replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: getCurrentDate(),
        items: [
          {
            id: '1',
            name: 'Paracetamol 500mg',
            nameHi: 'पैरासिटामोल 500 मिलीग्राम',
            quantity: 2,
            price: 45.00,
            image: '/placeholder-medicine.jpg'
          }
        ],
        totalAmount: 90.00,
        deliveryAddress: '123 Main Street, City, State - 123456',
        estimatedDelivery: generateEstimatedDelivery(),
        trackingNumber: generateTrackingNumber(),
        status: 'processing',
        statusHistory: [
          {
            id: '1',
            date: `${getCurrentDate()} 10:30 AM`,
            status: 'processing',
            statusHi: 'प्रसंस्करण',
            statusEn: 'Processing'
          }
        ]
      }
    ];
    
    localStorage.setItem(ordersKey, JSON.stringify(defaultOrders));
  }
};

const OrderTracking: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load user orders from localStorage
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }

    // Initialize default orders if none exist for the user
    initializeDefaultOrders(user.id);
    
    const ordersKey = `user_orders_${user.id}`;
    const storedOrders = localStorage.getItem(ordersKey);
    
    if (storedOrders) {
      try {
        const parsedOrders: Order[] = JSON.parse(storedOrders);
        setOrders(parsedOrders);
        setFilteredOrders(parsedOrders);
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
        setOrders([]);
        setFilteredOrders([]);
      }
    } else {
      setOrders([]);
      setFilteredOrders([]);
    }
    
    setLoading(false);
  }, [isAuthenticated, user, navigate]);

  // Filter orders based on search term and tab selection
  useEffect(() => {
    let result = orders;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nameHi.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }

    setFilteredOrders(result);
  }, [searchTerm, activeTab, orders]);

  // Get status badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">{language === 'hi' ? 'प्रसंस्करण' : 'Processing'}</Badge>;
      case 'shipped':
        return <Badge variant="default">{language === 'hi' ? 'भेजा गया' : 'Shipped'}</Badge>;
      case 'out-for-delivery':
        return <Badge variant="outline">{language === 'hi' ? 'डिलीवरी के लिए निकाला गया' : 'Out for Delivery'}</Badge>;
      case 'delivered':
        return <Badge variant="default">{language === 'hi' ? 'वितरित' : 'Delivered'}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{language === 'hi' ? 'रद्द किया गया' : 'Cancelled'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'out-for-delivery':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <Package className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Calculate progress percentage based on status
  const getProgressValue = (status: string) => {
    switch (status) {
      case 'processing':
        return 25;
      case 'shipped':
        return 50;
      case 'out-for-delivery':
        return 75;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'hi' ? 'ऑर्डर ट्रैकिंग' : 'Order Tracking'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi' ? 'अपने ऑर्डर की स्थिति देखें और ट्रैक करें' : 'View and track your order status'}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'ऑर्डर खोजें...' : 'Search orders...'}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-max grid-cols-5">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              {language === 'hi' ? 'सभी' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs md:text-sm">
              {language === 'hi' ? 'प्रसंस्करण' : 'Processing'}
            </TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs md:text-sm">
              {language === 'hi' ? 'भेजा गया' : 'Shipped'}
            </TabsTrigger>
            <TabsTrigger value="out-for-delivery" className="text-xs md:text-sm">
              {language === 'hi' ? 'डिलीवरी के लिए' : 'Out for Delivery'}
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs md:text-sm">
              {language === 'hi' ? 'वितरित' : 'Delivered'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            {language === 'hi' ? 'ऑर्डर लोड हो रहे हैं...' : 'Loading orders...'}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">
            {language === 'hi' ? 'कोई ऑर्डर नहीं मिला' : 'No orders found'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'आपके पास कोई ऑर्डर नहीं है' : 'You have no orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-2 border-border overflow-hidden">
              <CardHeader className="bg-secondary/50 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{order.orderId}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {language === 'hi' ? `ऑर्डर दिनांक: ${order.date}` : `Order Date: ${order.date}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {language === 'hi' ? `₹${order.totalAmount}` : `₹${order.totalAmount}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'ट्रैकिंग नंबर:' : 'Tracking #:'} {order.trackingNumber}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {language === 'hi' ? 'प्रगति' : 'Progress'}
                    </span>
                    <span>{getProgressValue(order.status)}%</span>
                  </div>
                  <Progress value={getProgressValue(order.status)} className="h-2" />
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">
                    {language === 'hi' ? 'वस्तुएँ' : 'Items'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={language === 'hi' ? item.nameHi : item.name}
                          className="w-12 h-12 object-contain bg-muted rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium truncate">
                            {language === 'hi' ? item.nameHi : item.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {language === 'hi' ? 'मात्रा:' : 'Qty:'} {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {language === 'hi' ? 'अनुमानित डिलीवरी' : 'Estimated Delivery'}
                    </h4>
                    <p className="text-lg font-semibold">{order.estimatedDelivery}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {language === 'hi' ? 'डिलीवरी पता' : 'Delivery Address'}
                    </h4>
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h4 className="font-medium mb-3">
                    {language === 'hi' ? 'स्थिति इतिहास' : 'Status History'}
                  </h4>
                  <div className="space-y-4">
                    {order.statusHistory.map((status, index) => (
                      <div key={status.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                            {index === order.statusHistory.length - 1 ? (
                              <CheckCircle className="w-4 h-4 text-primary-foreground" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          {index < order.statusHistory.length - 1 && (
                            <div className="h-12 w-0.5 bg-primary mt-1 flex-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">
                                {language === 'hi' ? status.statusHi : status.statusEn}
                              </p>
                              <p className="text-sm text-muted-foreground">{status.date}</p>
                            </div>
                            {getStatusBadge(status.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;