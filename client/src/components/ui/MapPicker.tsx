"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

interface MapPickerProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
    // Default to Colombo, Sri Lanka if no location set
    const defaultCenter: [number, number] = [6.9271, 79.8612];
    const position: [number, number] | null = latitude && longitude ? [latitude, longitude] : null;

    return (
        <MapContainer
            center={position || defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 10 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={onChange} />
        </MapContainer>
    );
}
