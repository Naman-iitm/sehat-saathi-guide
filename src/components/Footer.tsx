import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-white border-t border-border mt-auto relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Heart className="w-7 h-7 text-primary-foreground fill-current" />
                            </div>
                            <span className="font-bold text-2xl text-foreground tracking-tight">
                                {t.appName}
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
                            {t.welcomeMessage}
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-foreground">{t.quickLinks}</h3>
                        <ul className="space-y-4">
                            {[
                                { path: '/', label: t.home },
                                { path: '/symptoms', label: t.symptomTracker },
                                { path: '/tips', label: t.healthTips },
                                { path: '/store', label: t.medicineStore },
                                { path: '/schemes', label: t.sarkariYojana },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-muted-foreground hover:text-primary transition-colors text-base flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-foreground">{t.support}</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-base flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                    {t.helpCenter}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-base flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                    {t.feedback}
                                </Link>
                            </li>
                            <li className="pt-2">
                                <div className="flex items-center gap-3 text-muted-foreground group hover:text-primary transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">+91 1800-123-4567</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-3 text-muted-foreground group hover:text-primary transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">support@swasthya.com</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-foreground">{t.followUs}</h3>
                        <div className="bg-secondary/20 p-6 rounded-2xl space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Stay updated with our latest health tips and features.
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder={t.email}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <Button className="w-full rounded-xl gap-2 shadow-md hover:shadow-lg transition-all">
                                    {t.send}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors block">
                                {t.privacyPolicy}
                            </Link>
                            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors block">
                                {t.termsConditions}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-16 pt-8 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                        © {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
