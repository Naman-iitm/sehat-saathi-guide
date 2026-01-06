import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AsyncErrorFallback from "@/components/AsyncErrorFallback";


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
    phone: '+91 1234567890',
    hours: '24 hours',
    lat: 26.9124,
    lng: 80.9558,
  },
  {
    id: '2',
    name: 'Community Health Centre',
    type: 'Government',
    distance: '5.8 km',
    address: 'District Road, Block Office',
    phone: '+91 9876543210',
    hours: '24 hours',
    lat: 26.9224,
    lng: 80.9658,
  },
  {
    id: '3',
    name: 'District Hospital',
    type: 'Government',
    distance: '12 km',
    address: 'Civil Lines, District HQ',
    phone: '+91 1122334455',
    hours: '24 hours',
    lat: 26.9324,
    lng: 80.9758,
  },
  {
    id: '4',
    name: 'Jan Aushadhi Kendra',
    type: 'Pharmacy',
    distance: '1.2 km',
    address: 'Main Market, Near Post Office',
    phone: '+91 5566778899',
    hours: '9 AM - 9 PM',
    lat: 26.9024,
    lng: 80.9458,
  },
];

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fetch nearby hospitals from Overpass API
async function fetchNearbyHospitals(lat: number, lng: number): Promise<Hospital[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:10000,${lat},${lng});
      way["amenity"="hospital"](around:10000,${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    if (!response.ok) throw new Error('API request failed');

    interface OverpassElement {
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags: {
        name?: string;
        healthcare?: string;
        operator_type?: string;
        'addr:full'?: string;
        'addr:street'?: string;
        phone?: string;
        'contact:phone'?: string;
        opening_hours?: string;
      };
    }

    interface HospitalWithDistance extends Hospital {
      distanceNum: number;
    }

    const data = await response.json();
    const hospitals: Hospital[] = (data.elements as OverpassElement[])
      .filter((el) => el.tags?.name)
      .map((el, index: number): HospitalWithDistance => {
        const hospitalLat = el.lat || el.center?.lat || 0;
        const hospitalLng = el.lon || el.center?.lon || 0;
        const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);

        return {
          id: String(el.id || index),
          name: el.tags.name || 'Unknown Hospital',
          type: el.tags.healthcare || el.tags.operator_type || 'Hospital',
          distance: `${distance.toFixed(1)} km`,
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
          phone: el.tags.phone || el.tags['contact:phone'] || 'Phone not available',
          hours: el.tags.opening_hours || '24 hours',
          lat: hospitalLat,
          lng: hospitalLng,
          distanceNum: distance,
        };
      })
      .sort((a, b) => a.distanceNum - b.distanceNum)
      .slice(0, 4);

    return hospitals;
  } catch (error) {
    console.error('Failed to fetch hospitals:', error);
    return [];
  }
}

const NearbyHospitals: React.FC = () => {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [fetchingHospitals, setFetchingHospitals] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          setLoading(false);

          // Fetch real hospitals
          setFetchingHospitals(true);
          const nearbyHospitals = await fetchNearbyHospitals(userLocation.lat, userLocation.lng);
          if (nearbyHospitals.length > 0) {
            setHospitals(nearbyHospitals);
          }
          setFetchingHospitals(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Initialize map with Leaflet
  useEffect(() => {
    if (!mapRef.current || loading || mapInstanceRef.current) return;

    const defaultLat = 26.9124;
    const defaultLng = 80.9558;
    const mapLat = location?.lat ?? defaultLat;
    const mapLng = location?.lng ?? defaultLng;

    // Create map instance
    const map = L.map(mapRef.current).setView([mapLat, mapLng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom red icon for hospitals
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Blue icon for user location
    const blueIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add user location marker
    if (location) {
      L.marker([location.lat, location.lng], { icon: blueIcon })
        .addTo(map)
        .bindPopup('Your Location');
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, location]);

  // Update hospital markers when hospitals change
  useEffect(() => {
    if (!mapInstanceRef.current || loading) return;

    const map = mapInstanceRef.current;

    // Custom red icon for hospitals
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Remove existing hospital markers (keep user marker)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.getPopup()?.getContent() !== 'Your Location') {
        map.removeLayer(layer);
      }
    });

    // Add hospital markers
    hospitals.forEach((hospital) => {
      L.marker([hospital.lat, hospital.lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(`<b>${hospital.name}</b><br/>${hospital.type}<br/>${hospital.distance}`);
    });
  }, [hospitals, loading]);

  const openInMaps = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.nearbyHospitals}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi'
            ? 'आपके पास के अस्पताल और क्लिनिक'
            : 'Hospitals and clinics near you'}
        </p>
      </div>

      {/* Leaflet Map */}
      <Card className="mb-8 border-2 border-border overflow-hidden">
        <div className="relative h-64">
          {loading ? (
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
        {location && (
          <div className="p-3 bg-secondary/50 text-center text-sm text-muted-foreground">
            📍 {language === 'hi' ? 'आपका स्थान' : 'Your location'}: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}
      </Card>

      {/* Loading indicator for hospitals */}
      {fetchingHospitals && (
        <div className="text-center mb-4 text-muted-foreground">
          {language === 'hi' ? 'नजदीकी अस्पताल खोज रहे हैं...' : 'Finding nearby hospitals...'}
        </div>
      )}

      {/* Hospital List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-2"
                  onClick={() => openInMaps(hospital)}
                >
                  <Navigation className="w-4 h-4" />
                  {language === 'hi' ? 'रास्ता देखें' : 'Get Directions'}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => window.open(`tel:${hospital.phone}`)}
                >
                  <Phone className="w-4 h-4" />
                  {language === 'hi' ? 'कॉल करें' : 'Call'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyHospitals;
