"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BottomNav } from '@/components/ui/BottomNav';

// Dynamically import Map
const Map = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl mb-4"></div>
});

export default function ServicesPage() {
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setUserLocation([6.9271, 79.8612]); // Fallback Colombo
                }
            );
        } else {
            setUserLocation([6.9271, 79.8612]);
        }
    }, []);

    useEffect(() => {
        const fetchMechanics = async () => {
            try {
                let url = 'http://localhost:5000/api/mechanics';
                if (userLocation) {
                    url += `?lat=${userLocation[0]}&lng=${userLocation[1]}&radius=20`;
                }
                const res = await fetch(url);
                const data = await res.json();

                if (data.data && Array.isArray(data.data)) {
                    setMechanics(data.data);
                } else if (Array.isArray(data)) {
                    setMechanics(data);
                } else {
                    setMechanics([]);
                }
            } catch (error) {
                console.error("Error fetching mechanics", error);
            } finally {
                setLoading(false);
            }
        };

        if (userLocation) {
            fetchMechanics();
        }
    }, [userLocation]);

    const mapMarkers = mechanics.map(mech => ({
        id: mech._id,
        position: [mech.location.coordinates[1], mech.location.coordinates[0]] as [number, number],
        title: mech.businessName,
        description: mech.description,
        type: 'mechanic' as const
    }));

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <div className="fixed top-0 z-30 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <h1 className="text-xl font-black text-text-main dark:text-white">Find Mechanic</h1>
            </div>

            <main className="pt-24 px-6">
                {/* Map Section */}
                <div className="mb-6">
                    {userLocation && (
                        <Map
                            center={userLocation}
                            markers={mapMarkers}
                            height="200px"
                        />
                    )}
                </div>

                {/* List Section */}
                <h2 className="text-lg font-bold text-text-main dark:text-white mb-4">Nearby Specialists ({mechanics.length})</h2>

                <div className="grid gap-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Scanning area...</p>
                    ) : mechanics.length === 0 ? (
                        <p className="text-center text-gray-500">No mechanics found nearby.</p>
                    ) : (
                        mechanics.map((mech) => (
                            <div key={mech._id} className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-800 flex gap-4">
                                <div className="h-16 w-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                    {mech.photos && mech.photos.length > 0 ? (
                                        <img src={`http://localhost:5000${mech.photos[0]}`} className="h-full w-full object-cover" alt="Garage" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                                            <span className="material-symbols-outlined">storefront</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-main dark:text-white line-clamp-1">{mech.businessName}</h3>
                                        <span className="flex items-center text-xs font-bold text-yellow-500">
                                            <span className="material-symbols-outlined text-[14px] mr-0.5">star</span>
                                            4.8
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-sub dark:text-gray-400 line-clamp-2 mt-1 mb-2">{mech.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {mech.services?.slice(0, 2).map((s: any, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-bold text-text-sub dark:text-gray-300">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
