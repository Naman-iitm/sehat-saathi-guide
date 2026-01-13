import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';


const validateEmail = (email: string) => {
    // simple RFC-5322-ish email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const invalidMsg = (t.invalidEmail as string) || 'Please enter a valid email address.';

        if (!email.trim()) {
            toast({ variant: 'destructive', title: t.subscribeError, description: invalidMsg });
            setMessage(invalidMsg);
            setMessageType('error');
            return;
        }

        if (!validateEmail(email)) {
            toast({ variant: 'destructive', title: t.subscribeError, description: invalidMsg });
            setMessage(invalidMsg);
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);

        try {
            // simulate network request
            await new Promise((resolve) => setTimeout(resolve, 700));

            const subscribers: string[] = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');

            if (subscribers.includes(email)) {
                const msg = 'This email is already subscribed to our newsletter.';
                toast({ variant: 'destructive', title: 'Already Subscribed', description: msg });
                setMessage(msg);
                setMessageType('error');
            } else {
                subscribers.push(email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));

                const successMsg = "You're subscribed! We'll send updates to your inbox.";
                toast({ title: t.subscribeSuccess, description: "You'll receive our latest health tips and updates." });
                setMessage(successMsg);
                setMessageType('success');
                setEmail('');
            }
        } catch (err) {
            const errMsg = 'Something went wrong. Please try again.';
            toast({ variant: 'destructive', title: t.subscribeError, description: errMsg });
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
            if (message) {
                setTimeout(() => {
                    setMessage('');
                    setMessageType('');
                }, 5000);
            }
        }
    };

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                {/* Newsletter Section */}
                {/* <div className="mb-12 max-w-2xl mx-auto">
                    <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-2xl p-8 border border-primary/20">
                        <div className="text-center mb-6">
                            <h3 className="font-bold text-2xl mb-2 text-foreground">{t.newsletterTitle}</h3>
                            <p className="text-muted-foreground text-sm">{t.stayUpdated || 'Stay updated with our latest health tips and features.'}</p>
                        </div>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.email || 'Enter Email ID'}
                                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                disabled={isSubmitting}
                                aria-label="Email for newsletter"
                            />

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="sm:w-auto w-full font-semibold"
                                aria-label="Subscribe to receive health tips and updates"
                                title="Subscribe to receive health tips and updates"
                            >
                                <Send className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                                {isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
                            </Button>
                        </form>

                        {message && (
                            <div
                                role="status"
                                aria-live="polite"
                                className={`mt-3 px-3 py-2 text-sm rounded-md ${
                                    messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </div> */}



<div className="mb-12 max-w-3xl mx-auto">
  <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-white shadow-lg">
    
    {/* Gradient accent */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 pointer-events-none" />

    <div className="relative p-8 sm:p-10">
      <div className="text-center mb-6">
        <h3 className="font-bold text-2xl sm:text-3xl text-foreground mb-2">
          {t.newsletterTitle}
        </h3>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          {t.stayUpdated || 'Stay updated with our latest health tips and features.'}
        </p>
      </div>

      <form
        onSubmit={handleNewsletterSubmit}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.email || 'Enter your email address'}
          className="w-full flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          disabled={isSubmitting}
          aria-label="Email for newsletter"
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 transition"
        >
          <Send className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>

      {message && (
  <div
    role="status"
    aria-live="polite"
    className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium rounded-md px-4 py-2 ${
      messageType === 'success'
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}
  >
    {messageType === 'success' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    )}
    <span>{message}</span>
  </div>
)}

    </div>
  </div>
</div>










                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-md">
                                <Heart className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl text-foreground">{t.appName}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.welcomeMessage}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t.quickLinks}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.home}
                                </Link>
                            </li>
                            <li>
                                <Link to="/symptoms" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.symptomTracker}
                                </Link>
                            </li>
                            <li>
                                <Link to="/tips" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.healthTips}
                                </Link>
                            </li>
                            <li>
                                <Link to="/store" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.medicineStore}
                                </Link>
                            </li>
                            <li>
                                <Link to="/schemes" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.sarkariYojana}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t.support}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.helpCenter}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSdcOXvJuxajDPVtOQEPl2g9xKYB81FO9_RfEsQpz7jajvghzA/viewform?usp=publish-editor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary text-sm"
                                >
                                    {t.feedback}
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+9118001234567" aria-label="Call +91 1800-123-4567" className="hover:text-primary">
                                    +91 1800-123-4567
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:support@swasthya.com" aria-label="Email support@swasthya.com" className="hover:text-primary">
                                    support@swasthya.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t.legal}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.privacyPolicy}
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary text-sm">
                                    {t.termsConditions}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
