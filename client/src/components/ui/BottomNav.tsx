"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { icon: 'home', label: 'Home', path: '/driver/dashboard' },
        { icon: 'car_repair', label: 'Mechanic', path: '/driver/services' },
        { icon: 'sos', label: 'Emergency', path: '/driver/emergency', isFab: true },
        { icon: 'local_parking', label: 'Parking', path: '/driver/parking' },
        { icon: 'person', label: 'Profile', path: '/driver/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#21242c]/95 backdrop-blur-lg pb-safe">
            <div className="flex items-center justify-between px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;

                    if (item.isFab) {
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className="relative -top-6 flex flex-col items-center justify-center"
                            >
                                <div className="h-14 w-14 rounded-full bg-red-500 shadow-lg shadow-red-500/40 flex items-center justify-center text-white transition-transform active:scale-95">
                                    <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold text-red-500 mt-1">{item.label}</span>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors group ${isActive ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[26px] transition-transform ${isActive ? 'fill-current' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
            </div>
            <div className="h-4 w-full"></div>
        </div>
    );
}
