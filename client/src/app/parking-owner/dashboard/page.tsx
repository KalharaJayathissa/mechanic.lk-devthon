"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function ParkingDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        fetch('http://localhost:5000/api/parking/stats', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));

    }, [router]);

    return (
        <div className="relative min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="fixed top-0 z-30 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">Parking Manager</p>
                    <h1 className="text-xl font-black text-text-main dark:text-white leading-tight">{user?.name || 'Owner'}</h1>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_parking</span>
                </div>
            </div>

            <main className="pt-24 px-6 space-y-6">
                {/* Live Status Card */}
                <div className="rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-6 text-white shadow-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-9xl">monitor_heart</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold">Live Occupancy</h2>
                            <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold backdrop-blur-sm">Now</span>
                        </div>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-black">{stats?.occupancyRate || 0}%</span>
                            <span className="text-sm font-medium opacity-80 mb-2">Full</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                            <div className="bg-white rounded-full h-2" style={{ width: `${stats?.occupancyRate || 0}%` }}></div>
                        </div>
                        <p className="mt-3 text-sm font-medium opacity-90">
                            {stats?.occupiedSpots || 0} / {stats?.totalSpots || 0} spots occupied
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/parking-owner/rates')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">currency_exchange</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Manage Rates</span>
                    </button>

                    <button
                        onClick={() => router.push('/parking-owner/add')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">add_location_alt</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Add Spot</span>
                    </button>
                </div>

                {/* Revenue Block */}
                <div className="rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft">
                    <h3 className="text-base font-bold text-text-main dark:text-white mb-4">Total Revenue</h3>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-main dark:text-white">${stats?.revenue || 0}</p>
                            <p className="text-xs text-text-sub dark:text-gray-400">Total earnings to date</p>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
