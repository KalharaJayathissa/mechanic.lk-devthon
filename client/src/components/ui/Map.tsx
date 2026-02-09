"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color: string) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultIcon = createIcon('blue');
const mechanicIcon = createIcon('red');
const parkingIcon = createIcon('green');

interface MapProps {
    center: [number, number];
    markers?: Array<{
        id: string;
        position: [number, number];
        title: string;
        description?: string;
        type?: 'user' | 'mechanic' | 'parking';
    }>;
    onLocationSelect?: (lat: number, lng: number) => void;
    height?: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const map = useMap();
    useEffect(() => {
        map.on('click', (e) => {
            onSelect(e.latlng.lat, e.latlng.lng);
        });
    }, [map, onSelect]);
    return null;
}

export default function Map({ center, markers = [], onLocationSelect, height = "400px" }: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: height, width: "100%", zIndex: 0 }}
            className="rounded-xl overflow-hidden shadow-inner"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            {onLocationSelect && <LocationSelector onSelect={onLocationSelect} />}

            {/* User Marker */}
            <Marker position={center} icon={defaultIcon}>
                <Popup>You are here</Popup>
            </Marker>

            {/* Other Markers */}
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={marker.type === 'mechanic' ? mechanicIcon : (marker.type === 'parking' ? parkingIcon : defaultIcon)}
                >
                    <Popup>
                        <div className="p-1">
                            <strong className="block text-sm font-bold text-gray-900">{marker.title}</strong>
                            {marker.description && <p className="text-xs text-gray-600 mt-1">{marker.description}</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
