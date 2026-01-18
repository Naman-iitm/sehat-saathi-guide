import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Linkedin, Mail, Phone, Send, X, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [emailValid, setEmailValid] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showUnsubscribe, setShowUnsubscribe] = useState(false);

    // Real-time email validation
    useEffect(() => {
        if (email.length === 0) {
            setEmailValid(null);
        } else if (email.length > 3) {
            setEmailValid(validateEmail(email));
        }
    }, [email]);

    // Check if user is already subscribed
    useEffect(() => {
        if (email && validateEmail(email)) {
            const subscribers: string[] = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            setShowUnsubscribe(subscribers.includes(email));
        } else {
            setShowUnsubscribe(false);
        }
    }, [email]);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const invalidMsg = (t.invalidEmail as string) || 'Please enter a valid email address.';

        if (!email.trim()) {
            toast({ variant: 'destructive', title: t.subscribeError, description: 'Email field cannot be empty.' });
            setMessage('Email field cannot be empty.');
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
                setShowConfetti(true);
                setEmail('');
                
                // Hide confetti after 3 seconds
                setTimeout(() => setShowConfetti(false), 3000);
            }
        } catch (err) {
            const errMsg = 'Something went wrong. Please try again.';
            toast({ variant: 'destructive', title: t.subscribeError, description: errMsg });
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
        }
    };

    const handleUnsubscribe = async () => {
        if (!email || !validateEmail(email)) return;

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const subscribers: string[] = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            const updated = subscribers.filter(sub => sub !== email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(updated));

            toast({ title: 'Unsubscribed', description: 'You have been unsubscribed from our newsletter.' });
            setMessage('Successfully unsubscribed from newsletter.');
            setMessageType('success');
            setEmail('');
            setShowUnsubscribe(false);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to unsubscribe. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                {/* Newsletter Section */}
                <div className="mb-12 max-w-3xl mx-auto">
    <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-white shadow-lg">
        
        {/* Gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 pointer-events-none" />

        {/* Confetti Animation */}
        {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="confetti-animation">
                    {[...Array(20)].map((_, i) => (
                        <Sparkles 
                            key={i} 
                            className="absolute text-green-500 animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-20px',
                                animationDelay: `${Math.random() * 0.5}s`,
                                animationDuration: `${1 + Math.random()}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        )}

        <div className="relative p-8 sm:p-10">
            <div className="text-center mb-6">
                <h3 className="font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
                    {t.newsletterTitle}
                </h3>
                <p className="text-gray-800 text-sm max-w-xl mx-auto font-medium">
                    {t.stayUpdated || 'Stay updated with our latest health tips and features.'}
                </p>
            </div>

            <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 items-stretch"
            >
                <div className="relative flex-1 w-full">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.email || 'Enter your email address'}
                        className={`w-full px-4 py-3 pr-10 rounded-lg border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition ${
                            emailValid === null 
                                ? 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                : emailValid
                                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        }`}
                        disabled={isSubmitting}
                        aria-label="Email for newsletter"
                        aria-invalid={emailValid === false}
                        aria-describedby={emailValid === false ? "email-error" : undefined}
                    />
                    
                    {/* Email Validation Indicator */}
                    {email.length > 0 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {emailValid === null ? (
                                <AlertCircle className="w-5 h-5 text-gray-400" />
                            ) : emailValid ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                    )}
                </div>

                {!showUnsubscribe ? (
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || !emailValid}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 transition"
                        aria-label="Subscribe to newsletter"
                    >
                        <Send className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="lg"
                        onClick={handleUnsubscribe}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full sm:w-auto border-red-500 text-red-600 hover:bg-red-50 font-semibold px-6 transition"
                        aria-label="Unsubscribe from newsletter"
                    >
                        <X className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                        {isSubmitting ? 'Processing...' : 'Unsubscribe'}
                    </Button>
                )}
            </form>

            {/* Email format hint */}
            {email.length > 0 && emailValid === false && (
                <p id="email-error" className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid email format (e.g., example@email.com)
                </p>
            )}

            {/* Status Message */}
            {message && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium rounded-md px-4 py-2 animate-fade-in ${
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

            {/* Subscriber count */}
            {!message && (
                <p className="mt-3 text-center text-xs text-gray-500">
                    Join {JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]').length} others already subscribed
                </p>
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
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t.welcomeMessage}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" onClick={(e) => e.preventDefault()}
                                title="Facebook page coming soon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                           <a href="#"onClick={(e) => e.preventDefault()}
                               title="X page coming soon"
                               className="text-muted-foreground hover:text-primary transition-colors"
                               >
                                <X className="w-5 h-5" />
                            </a>
                            <a href="#" onClick={(e) => e.preventDefault()}
                                title="Instagram page coming soon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" onClick={(e) => e.preventDefault()}
                                title="Linkedin page coming soon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
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
                                
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcOXvJuxajDPVtOQEPl2g9xKYB81FO9_RfEsQpz7jajvghzA/viewform?usp=publish-editor"
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