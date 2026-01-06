import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-md">
                                <Heart className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl text-foreground">
                                {t.appName}
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t.welcomeMessage}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" onClick={(e) => e.preventDefault()}
                                title="Facebook page coming soon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" onClick={(e) => e.preventDefault()}
                                title="Twitter page coming soon" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
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
                                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.home}
                                </Link>
                            </li>
                            <li>
                                <Link to="/symptoms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.symptomTracker}
                                </Link>
                            </li>
                            <li>
                                <Link to="/tips" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.healthTips}
                                </Link>
                            </li>
                            <li>
                                <Link to="/store" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.medicineStore}
                                </Link>
                            </li>
                            <li>
                                <Link to="/schemes" className="text-muted-foreground hover:text-primary transition-colors text-sm">
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
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.helpCenter}
                                </Link>
                            </li>
                            <li>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcOXvJuxajDPVtOQEPl2g9xKYB81FO9_RfEsQpz7jajvghzA/viewform?usp=publish-editor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                    {t.feedback}
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>+91 1800-123-4567</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>support@swasthya.com</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">{t.legal}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.privacyPolicy}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    {t.termsConditions}
                                </Link>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium text-sm mb-2">{t.followUs}</h4>
                            <p className="text-xs text-muted-foreground">
                                Stay updated with our latest health tips and features.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="email"
                                    placeholder={t.email}
                                    className="px-3 py-1.5 rounded-md border text-sm w-full bg-background"
                                />
                                <Button size="sm" variant="default">
                                    {t.send}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
