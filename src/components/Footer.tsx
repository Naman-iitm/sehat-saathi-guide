import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Clock,
    ExternalLink,
    Navigation,
    Building2,
    Shield,
    Award,
    CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Lazy load the map component for performance
const FooterMap = lazy(() => import('./FooterMap'));

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const [showMap, setShowMap] = useState(false);

    // Lazy load map when in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShowMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        const footer = document.getElementById('footer-section');
        if (footer) {
            observer.observe(footer);
        }

        return () => observer.disconnect();
    }, []);

    // Organization location (Delhi, India - example)
    const officeLocation = {
        lat: 28.6139,
        lng: 77.2090,
        address: "123 Health Plaza, Connaught Place",
        city: "New Delhi, Delhi 110001",
        country: "India"
    };

    const getDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`;

    return (
        <footer id="footer-section" className="bg-gradient-to-b from-card to-background border-t border-border mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-105">
                                <Heart className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors">
                                {t.appName}
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {t.welcomeMessage}
                        </p>

                        {/* Social Links with Animation */}
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600" },
                                { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500" },
                                { icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
                                { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700" }
                            ].map(({ icon: Icon, label, color }) => (
                                <a
                                    key={label}
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    title={`${label} page coming soon`}
                                    className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-white ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-chart-2 rounded-full"></div>
                            {t.quickLinks}
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/", label: t.home },
                                { to: "/symptoms", label: t.symptomTracker },
                                { to: "/tips", label: t.healthTips },
                                { to: "/store", label: t.medicineStore },
                                { to: "/schemes", label: t.sarkariYojana }
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-0.5 bg-primary group-hover:w-3 transition-all duration-200"></span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-chart-2 rounded-full"></div>
                            {t.support}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary/70" />
                                    {t.helpCenter}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSdcOXvJuxajDPVtOQEPl2g9xKYB81FO9_RfEsQpz7jajvghzA/viewform?usp=publish-editor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4 text-primary/70" />
                                    {t.feedback}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+911800123456"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                                >
                                    <Phone className="w-4 h-4 text-primary/70 group-hover:animate-pulse" />
                                    <span>+91 1800-123-4567</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@swasthya.com"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4 text-primary/70" />
                                    <span>support@swasthya.com</span>
                                </a>
                            </li>
                            <li>
                                <div className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary/70" />
                                    <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Our Location with Map */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-chart-2 rounded-full"></div>
                            <MapPin className="w-5 h-5 text-primary" />
                            Our Location
                        </h3>

                        {/* Map Container */}
                        <div className="relative rounded-xl overflow-hidden border border-border shadow-lg bg-muted/30">
                            <div className="h-48 md:h-56 w-full">
                                {showMap ? (
                                    <Suspense fallback={
                                        <div className="h-full w-full flex items-center justify-center bg-muted/50">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm">Loading map...</span>
                                            </div>
                                        </div>
                                    }>
                                        <FooterMap
                                            lat={officeLocation.lat}
                                            lng={officeLocation.lng}
                                        />
                                    </Suspense>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-muted/50">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-8 h-8 text-primary/50" />
                                            <span className="text-sm">Loading location...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location Info Overlay */}
                            <div className="p-4 bg-gradient-to-t from-card via-card to-card/95 border-t border-border">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{officeLocation.address}</p>
                                                <p className="text-xs text-muted-foreground">{officeLocation.city}, {officeLocation.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={getDirectionsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 whitespace-nowrap"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter & Legal Section */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Newsletter */}
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50">
                                <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    {t.followUs}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Stay updated with our latest health tips and features.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder={t.email}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    />
                                    <Button size="default" variant="default" className="px-6 shadow-lg shadow-primary/25">
                                        {t.send}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-base flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                {t.legal}
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/privacy-policy"
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {t.privacyPolicy}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/terms-and-conditions"
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        {t.termsConditions}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-base flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Certifications
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span className="text-xs font-medium">SSL Secured</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                                    <Award className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs font-medium">HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span className="text-xs font-medium">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-muted/30 border-t border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            © {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                            <span>for better health</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
