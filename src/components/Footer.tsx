import React from 'react';
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
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand */}
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
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.quickLinks}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link className="text-muted-foreground hover:text-primary" to="/">{t.home}</Link></li>
              <li><Link className="text-muted-foreground hover:text-primary" to="/symptoms">{t.symptomTracker}</Link></li>
              <li><Link className="text-muted-foreground hover:text-primary" to="/tips">{t.healthTips}</Link></li>
              <li><Link className="text-muted-foreground hover:text-primary" to="/store">{t.medicineStore}</Link></li>
              <li><Link className="text-muted-foreground hover:text-primary" to="/schemes">{t.sarkariYojana}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.support}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 1800-123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@swasthya.com
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.legal}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary">
                  {t.termsConditions}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Our Location
            </h3>

            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                title="IIT Madras"
                src="https://www.openstreetmap.org/export/embed.html?bbox=80.2245%2C12.9875%2C80.2375%2C12.9995&layer=mapnik&marker=12.9935%2C80.2310"
                className="w-full h-40"
                loading="lazy"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Inspired by SAATHI Initiative</p>
              <p>Indian Institute of Technology Madras</p>
              <p>Chennai, Tamil Nadu – 600036</p>
              <p>India</p>
            </div>

            <a
              href="https://www.google.com/maps?q=IIT+Madras"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <MapPin className="w-4 h-4" />
              Get Directions →
            </a>
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
