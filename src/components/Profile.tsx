import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, LogOut, Package } from 'lucide-react';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto border-2 border-border">
        <CardHeader className="bg-primary text-primary-foreground text-center">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10" />
          </div>
          <CardTitle>{user?.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
            <div><p className="text-sm text-muted-foreground">{t.email}</p><p className="font-medium">{user?.email}</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
            <div><p className="text-sm text-muted-foreground">{t.phone}</p><p className="font-medium">{user?.phone}</p></div>
          </div>
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={() => navigate('/edit-profile')}
          >
            <User className="w-4 h-4" />{language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={() => navigate('/order-tracking')}
          >
            <Package className="w-4 h-4" />{language === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Orders'}
          </Button>
          <Button variant="destructive" className="w-full gap-2" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="w-4 h-4" />{t.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
