import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AsyncErrorFallback from '@/components/AsyncErrorFallback';
import { MapPin, Navigation, Phone, Clock, CalendarPlus } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppointmentBooking from './AppointmentBooking';

// Fix Leaflet default icon issue in bundlers
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Hospital {
  id: string;
  name: string;
  type: string;
  distance: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Primary Health Centre',
    type: 'Government',
    distance: '2.5 km',
    address: 'Village Road, Near Bus Stand',
    phone: '+911234567890',
    hours: '24 hours',
    lat: 26.9124,
    lng: 80.9558,
  },
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchNearbyHospitals(lat: number, lng: number): Promise<Hospital[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:10000,${lat},${lng});
      way["amenity"="hospital"](around:10000,${lat},${lng});
    );
    out center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hospitals');
  }

  const data = await response.json();

  return (data.elements || [])
    .filter((el: any) => el.tags?.name)
    .map((el: any): Hospital => {
      const hLat = el.lat || el.center?.lat;
      const hLng = el.lon || el.center?.lon;
      const distanceNum = calculateDistance(lat, lng, hLat, hLng);

      return {
        id: String(el.id),
        name: el.tags.name,
        type: el.tags.healthcare || 'Hospital',
        distance: `${distanceNum.toFixed(1)} km`,
        address:
          el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
        phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
        hours: el.tags.opening_hours || '24 hours',
        lat: hLat,
        lng: hLng,
      };
    })
    .slice(0, 4);
}

const NearbyHospitals: React.FC = () => {
  const { t, language } = useLanguage();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const handleRetry = () => {
    setError(null);
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setIsLoadingLocation(false);
          loadHospitals(loc);
        },
        () => {
          setIsLoadingLocation(false);
          setError('Unable to access location');
        }
      );
    }
  };

  const loadHospitals = async (loc: { lat: number; lng: number }) => {
    setIsLoadingHospitals(true);
    try {
      const data = await fetchNearbyHospitals(loc.lat, loc.lng);
      if (data.length) setHospitals(data);
    } catch (e) {
      setError('Unable to load nearby hospitals');
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setIsLoadingLocation(false);
        loadHospitals(loc);
      },
      () => setIsLoadingLocation(false)
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || isLoadingLocation) return;

    const lat = userLocation?.lat ?? 26.9124;
    const lng = userLocation?.lng ?? 80.9558;

    const map = L.map(mapRef.current).setView([lat, lng], 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (userLocation) {
      L.marker([lat, lng]).addTo(map).bindPopup('Your Location');
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [userLocation, isLoadingLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.getPopup()?.getContent() !== 'Your Location') {
        map.removeLayer(layer);
      }
    });

    hospitals.forEach((h) => {
      L.marker([h.lat, h.lng])
        .addTo(map)
        .bindPopup(`<b>${h.name}</b><br/>${h.distance}`);
    });
  }, [hospitals]);

  const openInMaps = (h: Hospital) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`, '_blank');
  };

  if (error) {
    return <AsyncErrorFallback message={error} onRetry={() => userLocation && loadHospitals(userLocation)} />;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t.nearbyHospitals}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2">
          {language === 'hi'
            ? 'आपके पास के अस्पताल और क्लिनिक'
            : 'Hospitals and clinics near you'}
        </p>
      </div>

      {error ? (
        <AsyncErrorFallback message={error} onRetry={handleRetry} />
      ) : (
        <>
          <Card className="mb-6 sm:mb-8 border-2 border-border overflow-hidden">
            <div className="relative h-48 sm:h-64 md:h-96">
              {isLoadingLocation ? (
                <div className="h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
                    <p className="text-muted-foreground">
                      {language === 'hi' ? 'स्थान खोज रहे हैं...' : 'Finding your location...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div ref={mapRef} className="h-64 w-full z-0" />
              )}
            </div>
            {userLocation && (
              <div className="p-3 bg-secondary/50 text-center text-sm text-muted-foreground">
                📍 {language === 'hi' ? 'आपका स्थान' : 'Your location'}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </Card>

          {isLoadingHospitals && (
            <div className="text-center mb-4 text-xs sm:text-sm text-muted-foreground">
              {language === 'hi' ? 'नजदीकी अस्पताल खोज रहे हैं...' : 'Finding nearby hospitals...'}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {hospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="border-2 border-border shadow-sm hover:shadow-lg transition-all"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between">
                    <div>
                      <span className="text-lg text-foreground">{hospital.name}</span>
                      <span className="block text-sm font-normal text-primary mt-1">
                        {hospital.type}
                      </span>
                    </div>
                    <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {hospital.distance}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{hospital.hours}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => openInMaps(hospital)}>
                      <Navigation className="w-4 h-4" />
                      {language === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
                    </Button>
                    <Button size="sm" className="w-full gap-2" onClick={() => {
                      setSelectedHospital(hospital);
                      setBookingOpen(true);
                    }}>
                      <CalendarPlus className="w-4 h-4" />
                      {language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedHospital && (
            <AppointmentBooking hospital={selectedHospital} open={bookingOpen} onOpenChange={setBookingOpen} />
          )}
        </>
      )}
    </div>
  );
};

export default NearbyHospitals;