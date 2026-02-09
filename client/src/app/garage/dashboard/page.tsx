"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GarageBottomNav } from '@/components/ui/GarageBottomNav';

export default function GarageDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // Fetch user profile or get from local storage if available
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Fetch from API
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
                    <p className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">Welcome back</p>
                    <h1 className="text-xl font-black text-text-main dark:text-white leading-tight">{user?.name || 'Garage Owner'}</h1>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">garage</span>
                </div>
            </div>

            <main className="pt-24 px-6 space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/garage/add')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">add_business</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Add Spot</span>
                    </button>

                    <button
                        onClick={() => router.push('/garage/auctions')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white dark:bg-card-dark p-6 shadow-soft hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">gavel</span>
                        </div>
                        <span className="text-sm font-bold text-text-main dark:text-white">Repairs</span>
                    </button>
                </div>

                {/* Stats Overview (Placeholder) */}
                <div className="rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-6 text-white shadow-glow">
                    <h2 className="text-lg font-bold mb-4">Weekly Summary</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-blue-100 text-xs font-medium uppercase mb-1">Total Revenue</p>
                            <p className="text-2xl font-black">$1,240</p>
                        </div>
                        <div>
                            <p className="text-blue-100 text-xs font-medium uppercase mb-1">Jobs Done</p>
                            <p className="text-2xl font-black">12</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Requests</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-sm border border-gray-50 dark:border-gray-800">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0"></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-main dark:text-white text-sm">Toyota Corolla Repair</h4>
                                    <p className="text-xs text-text-sub dark:text-gray-400">2 mins ago</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <GarageBottomNav />
        </div>
    );
}
