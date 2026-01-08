import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FooterMapProps {
    lat: number;
    lng: number;
}

// Fix for default marker icon in Leaflet with bundlers
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const FooterMap: React.FC<FooterMapProps> = ({ lat, lng }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize the map
        const map = L.map(mapRef.current, {
            center: [lat, lng],
            zoom: 15,
            scrollWheelZoom: false,
            attributionControl: true,
            zoomControl: true
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add marker with custom icon
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Add popup
        marker.bindPopup(`
            <div style="text-align: center; padding: 8px;">
                <strong style="color: #0f766e; font-size: 14px;">Sehat Saathi HQ</strong><br/>
                <span style="font-size: 12px; color: #666;">123 Health Plaza<br/>Connaught Place<br/>New Delhi 110001</span>
            </div>
        `);

        // Enable scroll zoom on click
        map.on('click', () => {
            map.scrollWheelZoom.enable();
        });

        // Disable scroll zoom when mouse leaves
        map.on('mouseout', () => {
            map.scrollWheelZoom.disable();
        });

        mapInstanceRef.current = map;

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng]);

    return (
        <div
            ref={mapRef}
            className="h-full w-full"
            style={{
                minHeight: '200px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
            }}
        />
    );
};

export default FooterMap;
