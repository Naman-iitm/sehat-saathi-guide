import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail, FileText, Check, CalendarPlus, Loader2 } from 'lucide-react';
import { Appointment, TimeSlot } from '@/types/appointment';
import { saveAppointment, getAvailableSlots, downloadCalendarEvent } from '@/lib/appointmentStorage';
import { useToast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  phone: string;
}

interface AppointmentBookingProps {
  hospital: Hospital;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ hospital, open, onOpenChange }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'form' | 'slots' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientPhone: user?.phone || '',
    patientEmail: user?.email || '',
    date: '',
    time: '',
    reason: '',
  });

  const t = {
    en: {
      title: 'Book Appointment',
      subtitle: 'Schedule your visit',
      patientName: 'Patient Name',
      phone: 'Phone Number',
      email: 'Email (optional)',
      date: 'Select Date',
      reason: 'Reason for Visit',
      reasonPlaceholder: 'Describe your symptoms or reason...',
      next: 'Select Time Slot',
      selectSlot: 'Available Time Slots',
      morning: 'Morning',
      afternoon: 'Afternoon',
      book: 'Confirm Booking',
      back: 'Back',
      success: 'Appointment Booked!',
      successMsg: 'Your appointment has been scheduled.',
      addToCalendar: 'Add to Calendar',
      close: 'Close',
      noSlots: 'No slots available for this date',
    },
    hi: {
      title: 'अपॉइंटमेंट बुक करें',
      subtitle: 'अपनी विज़िट शेड्यूल करें',
      patientName: 'मरीज़ का नाम',
      phone: 'फ़ोन नंबर',
      email: 'ईमेल (वैकल्पिक)',
      date: 'तारीख़ चुनें',
      reason: 'विज़िट का कारण',
      reasonPlaceholder: 'अपने लक्षण या कारण बताएं...',
      next: 'समय चुनें',
      selectSlot: 'उपलब्ध समय स्लॉट',
      morning: 'सुबह',
      afternoon: 'दोपहर',
      book: 'बुकिंग कन्फर्म करें',
      back: 'वापस',
      success: 'अपॉइंटमेंट बुक हो गई!',
      successMsg: 'आपकी अपॉइंटमेंट शेड्यूल हो गई है।',
      addToCalendar: 'कैलेंडर में जोड़ें',
      close: 'बंद करें',
      noSlots: 'इस तारीख़ के लिए कोई स्लॉट उपलब्ध नहीं',
    },
  };

  const text = t[language as keyof typeof t] || t.en;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  // Get maximum date (30 days from now)
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: user.name || prev.patientName,
        patientPhone: user.phone || prev.patientPhone,
        patientEmail: user.email || prev.patientEmail,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (formData.date) {
      setSlots(getAvailableSlots(formData.date, hospital.id));
    }
  }, [formData.date, hospital.id]);

  const handleNext = () => {
    if (!formData.patientName || !formData.patientPhone || !formData.date || !formData.reason) {
      toast({ title: language === 'hi' ? 'सभी फ़ील्ड भरें' : 'Please fill all fields', variant: 'destructive' });
      return;
    }
    setStep('slots');
  };

  const handleBook = async () => {
    if (!formData.time) {
      toast({ title: language === 'hi' ? 'समय चुनें' : 'Please select a time slot', variant: 'destructive' });
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const appointment: Appointment = {
      id: Date.now().toString(),
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    saveAppointment(appointment);
    setBookedAppointment(appointment);
    setLoading(false);
    setStep('success');

    toast({
      title: text.success,
      description: `${formData.date} at ${formData.time}`,
    });
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      patientName: user?.name || '',
      patientPhone: user?.phone || '',
      patientEmail: user?.email || '',
      date: '',
      time: '',
      reason: '',
    });
    setBookedAppointment(null);
    onOpenChange(false);
  };

  const morningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 12);
  const afternoonSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 12);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {text.title}
          </DialogTitle>
          <DialogDescription>{hospital.name}</DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" /> {text.patientName}
              </Label>
              <Input
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter name"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" /> {text.phone}
              </Label>
              <Input
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" /> {text.email}
              </Label>
              <Input
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" /> {text.date}
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={today}
                max={maxDate}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" /> {text.reason}
              </Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={text.reasonPlaceholder}
                rows={3}
              />
            </div>

            <Button onClick={handleNext} className="w-full">
              {text.next}
            </Button>
          </div>
        )}

        {step === 'slots' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              {formData.date} • {hospital.name}
            </div>

            {slots.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">{text.noSlots}</p>
            ) : (
              <>
                {morningSlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">{text.morning}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {morningSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? 'default' : 'outline'}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setFormData({ ...formData, time: slot.time })}
                          className="text-xs"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {afternoonSlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">{text.afternoon}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {afternoonSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? 'default' : 'outline'}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setFormData({ ...formData, time: slot.time })}
                          className="text-xs"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                {text.back}
              </Button>
              <Button onClick={handleBook} disabled={!formData.time || loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : text.book}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && bookedAppointment && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600">{text.success}</h3>
              <p className="text-muted-foreground">{text.successMsg}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-2">
              <p><strong>{hospital.name}</strong></p>
              <p className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" /> {bookedAppointment.date}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" /> {bookedAppointment.time}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => downloadCalendarEvent(bookedAppointment)}
                className="flex-1 gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                {text.addToCalendar}
              </Button>
              <Button onClick={handleClose} className="flex-1">
                {text.close}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBooking;
