"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function DriverDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                fetch('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        setUser(data);
                        localStorage.setItem('user', JSON.stringify(data));
                    })
                    .catch(err => console.error(err));
            }
        }
    }, [router]);

    return (
        <div className="relative min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="fixed top-0 z-30 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">Good Morning</p>
                    <h1 className="text-xl font-black text-text-main dark:text-white leading-tight">{user?.name || 'Driver'}</h1>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">person</span>
                </div>
            </div>

            <main className="pt-24 px-6 space-y-6">
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/driver/parking')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">local_parking</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Find Parking</span>
                    </button>

                    <button
                        onClick={() => router.push('/driver/services')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">car_repair</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Mechanics</span>
                    </button>

                    <button
                        onClick={() => router.push('/driver/auction')}
                        className="col-span-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white shadow-glow hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="material-symbols-outlined text-xl">gavel</span>
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold mb-0.5">Request Repair</span>
                                <span className="block text-xs opacity-80">Post job for bidding</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-sm border border-gray-50 dark:border-gray-800">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main dark:text-white text-sm">Parking Reserved</h4>
                                <p className="text-xs text-text-sub dark:text-gray-400">Downtown Garage • 2 hrs ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
