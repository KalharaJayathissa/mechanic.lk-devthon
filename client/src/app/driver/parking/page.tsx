"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BottomNav } from '@/components/ui/BottomNav';
import { ParkingCard } from '@/components/features/ParkingCard';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-[calc(100vh-180px)] w-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function ParkingPage() {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [spots, setSpots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                    // Default to Colombo
                    setUserLocation([6.9271, 79.8612]);
                }
            );
        } else {
            console.error("Geolocation not supported");
            setUserLocation([6.9271, 79.8612]);
        }
    }, []);

    // Fetch Nearby Spots
    useEffect(() => {
        const fetchSpots = async () => {
            try {
                let url = 'http://localhost:5000/api/parking/nearby';
                if (userLocation) {
                    url += `?lat=${userLocation[0]}&long=${userLocation[1]}&radius=10`;
                }

                const res = await fetch(url);
                const data = await res.json();

                if (data.data && Array.isArray(data.data)) {
                    setSpots(data.data);
                } else if (Array.isArray(data)) {
                    setSpots(data);
                } else {
                    setSpots([]);
                }
            } catch (error) {
                console.error("Error fetching parking spots", error);
            } finally {
                setLoading(false);
            }
        };

        if (userLocation) {
            fetchSpots();
        }
    }, [userLocation]);

    const mapMarkers = spots.map(spot => ({
        id: spot._id,
        position: [spot.location.coordinates[1], spot.location.coordinates[0]] as [number, number],
        title: spot.title,
        description: `$${spot.pricePerHour}/hr`,
        type: 'parking' as const
    }));

    return (
        <div className="relative h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden flex flex-col">
            {/* Header */}
            <div className="absolute top-0 z-20 w-full px-6 pt-6 pb-2 bg-gradient-to-b from-background-light/90 to-transparent dark:from-background-dark/90 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 mb-4">
                    <div className="flex-1 bg-white dark:bg-card-dark rounded-full shadow-soft flex items-center p-1 pr-4 border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined text-gray-400 ml-3 mr-2">search</span>
                        <input
                            type="text"
                            placeholder="Find parking..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-text-main dark:text-white placeholder:text-text-sub"
                        />
                    </div>
                    <button className="h-10 w-10 rounded-full bg-white dark:bg-card-dark shadow-soft flex items-center justify-center text-text-main dark:text-white border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>

                {/* Toggle View */}
                <div className="pointer-events-auto flex p-1 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit mx-auto">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                    >
                        Map
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative mt-[130px]"> {/* Offset for header */}
                {/* Map View */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    {userLocation && (
                        <Map
                            center={userLocation}
                            markers={mapMarkers}
                            height="100%"
                        />
                    )}
                </div>

                {/* List View */}
                <div className={`absolute inset-0 overflow-y-auto px-6 pb-24 transition-opacity duration-300 ${viewMode === 'list' ? 'opacity-100 z-10 bg-background-light dark:bg-background-dark' : 'opacity-0 z-0 pointer-events-none'}`}>
                    {loading ? (
                        <p className="text-center text-gray-500 mt-10">Finding spots...</p>
                    ) : spots.length === 0 ? (
                        <div className="text-center mt-20 opacity-60">
                            <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
                            <p>No parking spots found nearby.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 pt-2">
                            {spots.map(spot => (
                                <ParkingCard
                                    key={spot._id}
                                    title={spot.title}
                                    description={spot.description}
                                    pricePerHour={spot.pricePerHour}
                                    distance="0.5km" // Calculate real distance if needed
                                    vehicleTypes={spot.vehicleTypes}
                                    onBook={() => console.log('Book', spot._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
