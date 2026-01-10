import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  getEmergencyContacts,
  addEmergencyContact,
  removeEmergencyContact,
  EmergencyContact,
  EMERGENCY_NUMBERS,
  generateSOSMessage,
  generateSMSLink,
  generateCallLink,
} from '@/lib/emergencyContacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  MessageSquare,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Settings,
  X,
} from 'lucide-react';

const SOSButton: React.FC = () => {
  const { language } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [activeTab, setActiveTab] = useState('emergency');
  
  const { latitude, longitude, loading: locationLoading, error: locationError, getCurrentPosition, hasLocation } = useGeolocation();

  const t = {
    en: {
      sos: 'SOS',
      emergency: 'Emergency',
      contacts: 'Contacts',
      confirmTitle: 'Emergency SOS',
      confirmDesc: 'This will alert your emergency contacts and share your location. Continue?',
      cancel: 'Cancel',
      confirm: 'Yes, Send SOS',
      callAmbulance: 'Call Ambulance (108)',
      callPolice: 'Call Police (100)',
      callNational: 'Call 112',
      sendSMS: 'Send SMS to Contacts',
      shareLocation: 'Share Location',
      gettingLocation: 'Getting location...',
      locationError: 'Could not get location',
      noContacts: 'No emergency contacts added',
      addContact: 'Add Contact',
      name: 'Name',
      phone: 'Phone',
      relationship: 'Relationship',
      manageContacts: 'Manage Contacts',
    },
    hi: {
      sos: 'SOS',
      emergency: 'आपातकाल',
      contacts: 'संपर्क',
      confirmTitle: 'आपातकालीन SOS',
      confirmDesc: 'यह आपके आपातकालीन संपर्कों को सूचित करेगा और आपका स्थान साझा करेगा। जारी रखें?',
      cancel: 'रद्द करें',
      confirm: 'हाँ, SOS भेजें',
      callAmbulance: 'एम्बुलेंस कॉल करें (108)',
      callPolice: 'पुलिस कॉल करें (100)',
      callNational: '112 कॉल करें',
      sendSMS: 'संपर्कों को SMS भेजें',
      shareLocation: 'स्थान साझा करें',
      gettingLocation: 'स्थान प्राप्त हो रहा है...',
      locationError: 'स्थान प्राप्त नहीं हो सका',
      noContacts: 'कोई आपातकालीन संपर्क नहीं जोड़ा गया',
      addContact: 'संपर्क जोड़ें',
      name: 'नाम',
      phone: 'फ़ोन',
      relationship: 'संबंध',
      manageContacts: 'संपर्क प्रबंधित करें',
    },
  };

  const text = t[language as keyof typeof t] || t.en;

  useEffect(() => {
    setContacts(getEmergencyContacts());
  }, []);

  const handleSOSClick = async () => {
    // Get location first
    try {
      await getCurrentPosition();
    } catch {
      // Continue even without location
    }
    setShowConfirm(true);
  };

  const handleConfirmSOS = () => {
    setShowConfirm(false);
    setShowDialog(true);
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const added = addEmergencyContact(newContact);
      setContacts([...contacts, added]);
      setNewContact({ name: '', phone: '', relationship: '' });
    }
  };

  const handleRemoveContact = (id: string) => {
    removeEmergencyContact(id);
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSendSMS = () => {
    if (contacts.length === 0) return;
    const phones = contacts.map(c => c.phone);
    const location = hasLocation ? { lat: latitude!, lng: longitude! } : undefined;
    const message = generateSOSMessage(location);
    window.location.href = generateSMSLink(phones, message);
  };

  const handleCall = (number: string) => {
    window.location.href = generateCallLink(number);
  };

  const handleShareLocation = () => {
    if (!hasLocation) return;
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Emergency Location',
        text: 'I need help! Here is my location:',
        url,
      });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-20 right-5 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 animate-pulse hover:animate-none"
        aria-label="Emergency SOS"
      >
        {text.sos}
      </button>

      {/* Settings Button */}
      <button
        onClick={() => { setShowDialog(true); setActiveTab('contacts'); }}
        className="fixed bottom-20 right-20 w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-50"
        aria-label="SOS Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              {text.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{text.confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{text.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSOS} className="bg-red-600 hover:bg-red-700">
              {text.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main SOS Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              {text.confirmTitle}
            </DialogTitle>
            <DialogDescription>
              {locationLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {text.gettingLocation}
                </span>
              ) : hasLocation ? (
                <span className="flex items-center gap-2 text-green-600">
                  <MapPin className="w-4 h-4" />
                  Location captured
                </span>
              ) : locationError ? (
                <span className="text-amber-600">{text.locationError}</span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="emergency">{text.emergency}</TabsTrigger>
              <TabsTrigger value="contacts">{text.contacts}</TabsTrigger>
            </TabsList>

            <TabsContent value="emergency" className="space-y-3 mt-4">
              {/* Emergency Call Buttons */}
              <Button
                onClick={() => handleCall(EMERGENCY_NUMBERS.ambulance)}
                className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {text.callAmbulance}
              </Button>

              <Button
                onClick={() => handleCall(EMERGENCY_NUMBERS.police)}
                variant="outline"
                className="w-full h-12 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Phone className="w-5 h-5 mr-2" />
                {text.callPolice}
              </Button>

              <Button
                onClick={() => handleCall(EMERGENCY_NUMBERS.national)}
                variant="outline"
                className="w-full h-12"
              >
                <Phone className="w-5 h-5 mr-2" />
                {text.callNational}
              </Button>

              <div className="border-t pt-3 space-y-3">
                <Button
                  onClick={handleSendSMS}
                  disabled={contacts.length === 0}
                  variant="secondary"
                  className="w-full h-12"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {text.sendSMS} ({contacts.length})
                </Button>

                <Button
                  onClick={handleShareLocation}
                  disabled={!hasLocation}
                  variant="outline"
                  className="w-full h-12"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {text.shareLocation}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4 mt-4">
              {/* Add Contact Form */}
              <div className="space-y-3 p-3 bg-secondary/50 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{text.name}</Label>
                    <Input
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{text.phone}</Label>
                    <Input
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">{text.relationship}</Label>
                    <Input
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      placeholder="Family / Friend"
                      className="h-9"
                    />
                  </div>
                  <Button
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.phone}
                    size="sm"
                    className="mt-5"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Contact List */}
              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">{text.noContacts}</p>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.phone} {contact.relationship && `• ${contact.relationship}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveContact(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
