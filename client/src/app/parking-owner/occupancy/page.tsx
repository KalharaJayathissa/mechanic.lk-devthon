"use client";

import { ParkingBottomNav } from '@/components/ui/ParkingBottomNav';
import { useRouter } from 'next/navigation';

export default function OccupancyPage() {
    const router = useRouter();
    // Mock data for occupancy
    const spots = [
        { id: 'A1', status: 'occupied', time: '2h 15m' },
        { id: 'A2', status: 'available', time: '-' },
        { id: 'A3', status: 'occupied', time: '45m' },
        { id: 'B1', status: 'reserved', time: 'Arriving in 10m' },
        { id: 'B2', status: 'available', time: '-' },
        { id: 'B3', status: 'occupied', time: '5h 30m' },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <div className="fixed top-0 z-30 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h1 className="text-xl font-black text-text-main dark:text-white">Live Status</h1>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-500 uppercase">Live</span>
                </div>
            </div>

            <main className="pt-24 px-6">
                <div className="grid grid-cols-2 gap-4">
                    {spots.map((spot) => (
                        <div
                            key={spot.id}
                            className={`rounded-2xl p-4 border-2 transition-all ${spot.status === 'available'
                                    ? 'border-green-500/20 bg-green-50 dark:bg-green-900/10'
                                    : spot.status === 'occupied'
                                        ? 'border-red-500/20 bg-red-50 dark:bg-red-900/10'
                                        : 'border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-lg font-black text-text-main dark:text-white">{spot.id}</span>
                                {spot.status === 'occupied' && <span className="material-symbols-outlined text-red-500">directions_car</span>}
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${spot.status === 'available' ? 'text-green-600' : spot.status === 'occupied' ? 'text-red-500' : 'text-yellow-600'
                                }`}>
                                {spot.status}
                            </div>
                            <div className="text-sm font-medium text-text-sub dark:text-gray-400">
                                {spot.time}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <ParkingBottomNav />
        </div>
    );
}
