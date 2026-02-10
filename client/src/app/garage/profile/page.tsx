"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

export default function GarageProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string, role?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-black text-text-main dark:text-white">My Profile</h1>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl">person</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-main dark:text-white">{user?.name || 'Garage Owner'}</h2>
                        <p className="text-sm text-text-sub dark:text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase">
                            {user?.role || 'Garage Owner'}
                        </span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-red-50 text-red-600 py-3 font-bold hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
