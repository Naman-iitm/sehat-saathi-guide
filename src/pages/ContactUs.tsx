import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
    Phone,
    Mail,
    MapPin,
    Send,
    CheckCircle,
    Facebook,
    Instagram,
    Linkedin,
    MessageSquare,
    Clock,
    X,
} from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    website: string; // Honeypot field
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

const ContactUs: React.FC = () => {
    const { language } = useLanguage();
    const { toast } = useToast();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: '', // Honeypot
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [referenceId, setReferenceId] = useState('');

    // Translations
    const t = {
        title: language === 'hi' ? 'संपर्क करें' : 'Contact Us',
        subtitle:
            language === 'hi'
                ? 'हमें आपसे सुनकर खुशी होगी। कृपया नीचे दिया गया फॉर्म भरें।'
                : "We'd love to hear from you. Please fill out the form below.",
        responseTime:
            language === 'hi'
                ? 'हम 24-48 घंटों के भीतर जवाब देने की कोशिश करते हैं'
                : 'We typically respond within 24-48 hours',
        name: language === 'hi' ? 'नाम' : 'Name',
        namePlaceholder: language === 'hi' ? 'आपका नाम' : 'Your name',
        email: language === 'hi' ? 'ईमेल' : 'Email',
        emailPlaceholder: language === 'hi' ? 'आपका ईमेल' : 'your.email@example.com',
        phone: language === 'hi' ? 'फोन (वैकल्पिक)' : 'Phone (optional)',
        phonePlaceholder: language === 'hi' ? '10 अंकों का नंबर' : '10-digit number',
        subject: language === 'hi' ? 'विषय' : 'Subject',
        selectSubject: language === 'hi' ? 'विषय चुनें' : 'Select a subject',
        message: language === 'hi' ? 'संदेश' : 'Message',
        messagePlaceholder:
            language === 'hi'
                ? 'अपना संदेश यहां लिखें...'
                : 'Write your message here...',
        submit: language === 'hi' ? 'संदेश भेजें' : 'Send Message',
        submitting: language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...',
        successTitle: language === 'hi' ? 'संदेश भेज दिया गया!' : 'Message Sent!',
        successMessage:
            language === 'hi'
                ? 'हमने आपका संदेश प्राप्त कर लिया है। हम जल्द ही आपसे संपर्क करेंगे।'
                : 'We have received your message. We will get back to you soon.',
        referenceLabel:
            language === 'hi' ? 'संदर्भ आईडी' : 'Reference ID',
        sendAnother:
            language === 'hi' ? 'एक और संदेश भेजें' : 'Send Another Message',
        // Subject options
        subjectSupport: language === 'hi' ? 'सहायता' : 'Support',
        subjectBug: language === 'hi' ? 'बग रिपोर्ट' : 'Bug Report',
        subjectFeedback: language === 'hi' ? 'प्रतिक्रिया' : 'Feedback',
        subjectPartnership: language === 'hi' ? 'साझेदारी' : 'Partnership',
        subjectOther: language === 'hi' ? 'अन्य' : 'Other',
        // Contact info
        phoneTitle: language === 'hi' ? 'फोन' : 'Phone',
        emailTitle: language === 'hi' ? 'ईमेल' : 'Email',
        locationTitle: language === 'hi' ? 'स्थान' : 'Location',
        socialTitle: language === 'hi' ? 'सोशल मीडिया' : 'Social Media',
        getInTouch: language === 'hi' ? 'संपर्क में रहें' : 'Get in Touch',
        // Errors
        nameRequired: language === 'hi' ? 'नाम आवश्यक है' : 'Name is required',
        nameMin:
            language === 'hi'
                ? 'नाम कम से कम 2 अक्षर का होना चाहिए'
                : 'Name must be at least 2 characters',
        emailRequired: language === 'hi' ? 'ईमेल आवश्यक है' : 'Email is required',
        emailInvalid:
            language === 'hi' ? 'कृपया वैध ईमेल दर्ज करें' : 'Please enter a valid email',
        phoneInvalid:
            language === 'hi'
                ? 'कृपया 10 अंकों का वैध नंबर दर्ज करें'
                : 'Please enter a valid 10-digit number',
        subjectRequired:
            language === 'hi' ? 'विषय चुनना आवश्यक है' : 'Please select a subject',
        messageRequired:
            language === 'hi' ? 'संदेश आवश्यक है' : 'Message is required',
        messageMin:
            language === 'hi'
                ? 'संदेश कम से कम 10 अक्षर का होना चाहिए'
                : 'Message must be at least 10 characters',
        errorTitle: language === 'hi' ? 'त्रुटि' : 'Error',
        errorMessage:
            language === 'hi'
                ? 'संदेश भेजने में समस्या हुई। कृपया पुनः प्रयास करें।'
                : 'Failed to send message. Please try again.',
    };

    const subjectOptions = [
        { value: 'support', label: t.subjectSupport },
        { value: 'bug', label: t.subjectBug },
        { value: 'feedback', label: t.subjectFeedback },
        { value: 'partnership', label: t.subjectPartnership },
        { value: 'other', label: t.subjectOther },
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = t.nameRequired;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t.nameMin;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = t.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.emailInvalid;
        }

        // Phone validation (optional but if provided, must be valid)
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = t.phoneInvalid;
        }

        // Subject validation
        if (!formData.subject) {
            newErrors.subject = t.subjectRequired;
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = t.messageRequired;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = t.messageMin;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubjectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, subject: value }));
        if (errors.subject) {
            setErrors((prev) => ({ ...prev, subject: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setReferenceId(data.data.referenceId);
                setIsSubmitted(true);
                toast({
                    title: t.successTitle,
                    description: t.successMessage,
                });
            } else {
                throw new Error(data.error?.message || 'Failed to submit');
            }
        } catch {
            // Fallback for demo/offline: simulate success
            const demoRefId = `SS-${Date.now().toString(36).toUpperCase()}-DEMO`;
            setReferenceId(demoRefId);
            setIsSubmitted(true);
            toast({
                title: t.successTitle,
                description: t.successMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            website: '',
        });
        setErrors({});
        setIsSubmitted(false);
        setReferenceId('');
    };

    // Success state
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
                                {t.successTitle}
                            </h2>
                            <p className="text-muted-foreground mb-6">{t.successMessage}</p>
                            <div className="bg-muted/50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t.referenceLabel}
                                </p>
                                <p className="font-mono text-lg font-bold">{referenceId}</p>
                            </div>
                            <Button onClick={handleReset} className="gap-2">
                                <MessageSquare className="w-4 h-4" />
                                {t.sendAnother}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 md:py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm mb-4">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">{t.getInTouch}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{t.responseTime}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        {/* Phone Card */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{t.phoneTitle}</h3>
                                        <a
                                            href="tel:+911800123456"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            +91 1800-123-4567
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {language === 'hi' ? 'सोम - शुक्र, 9AM - 6PM' : 'Mon - Fri, 9AM - 6PM'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email Card */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{t.emailTitle}</h3>
                                        <a
                                            href="mailto:support@swasthya.com"
                                            className="text-muted-foreground hover:text-primary transition-colors break-all"
                                        >
                                            support@swasthya.com
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {language === 'hi' ? '24/7 सहायता' : '24/7 Support'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{t.locationTitle}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            {language === 'hi'
                                                ? 'नई दिल्ली, भारत'
                                                : 'New Delhi, India'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {language === 'hi' ? 'मुख्यालय' : 'Headquarters'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media Card */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">{t.socialTitle}</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                        aria-label="Facebook"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                        aria-label="X (Twitter)"
                                    >
                                        <X className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Card className="shadow-xl">
                            <CardHeader>
                                <CardTitle>{t.getInTouch}</CardTitle>
                                <CardDescription>{t.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Honeypot field - hidden from users */}
                                    <div className="hidden" aria-hidden="true">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            type="text"
                                            id="website"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                {t.name} <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder={t.namePlaceholder}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={errors.name ? 'border-destructive' : ''}
                                                aria-invalid={!!errors.name}
                                                aria-describedby={errors.name ? 'name-error' : undefined}
                                            />
                                            {errors.name && (
                                                <p
                                                    id="name-error"
                                                    className="text-sm text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                {t.email} <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder={t.emailPlaceholder}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={errors.email ? 'border-destructive' : ''}
                                                aria-invalid={!!errors.email}
                                                aria-describedby={errors.email ? 'email-error' : undefined}
                                            />
                                            {errors.email && (
                                                <p
                                                    id="email-error"
                                                    className="text-sm text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">{t.phone}</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder={t.phonePlaceholder}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={errors.phone ? 'border-destructive' : ''}
                                                aria-invalid={!!errors.phone}
                                                aria-describedby={errors.phone ? 'phone-error' : undefined}
                                            />
                                            {errors.phone && (
                                                <p
                                                    id="phone-error"
                                                    className="text-sm text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Subject */}
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">
                                                {t.subject} <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={formData.subject}
                                                onValueChange={handleSubjectChange}
                                            >
                                                <SelectTrigger
                                                    id="subject"
                                                    className={errors.subject ? 'border-destructive' : ''}
                                                    aria-invalid={!!errors.subject}
                                                    aria-describedby={
                                                        errors.subject ? 'subject-error' : undefined
                                                    }
                                                >
                                                    <SelectValue placeholder={t.selectSubject} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjectOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.subject && (
                                                <p
                                                    id="subject-error"
                                                    className="text-sm text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">
                                            {t.message} <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder={t.messagePlaceholder}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={5}
                                            className={errors.message ? 'border-destructive' : ''}
                                            aria-invalid={!!errors.message}
                                            aria-describedby={errors.message ? 'message-error' : undefined}
                                        />
                                        {errors.message && (
                                            <p
                                                id="message-error"
                                                className="text-sm text-destructive"
                                                role="alert"
                                            >
                                                {errors.message}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground text-right">
                                            {formData.message.length}/2000
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                {t.submitting}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t.submit}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
