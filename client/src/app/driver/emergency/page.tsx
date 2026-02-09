"use client";

import { BottomNav } from '@/components/ui/BottomNav';

export default function EmergencyPage() {
    return (
        <div className="min-h-screen bg-red-50 dark:bg-red-950/20 pb-24 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-32 w-32 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-6 animate-pulse">
                <span className="material-symbols-outlined text-6xl">sos</span>
            </div>

            <h1 className="text-3xl font-black text-text-main dark:text-white mb-2">Emergency Help</h1>
            <p className="text-text-sub dark:text-gray-400 mb-8 max-w-xs">
                Quickly connect with nearby mechanics or emergency services.
            </p>

            <button className="w-full max-w-sm rounded-2xl bg-red-600 py-5 text-xl font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all mb-4">
                Call 119
            </button>
            <button className="w-full max-w-sm rounded-2xl bg-white dark:bg-card-dark py-5 text-lg font-bold text-text-main dark:text-white shadow-soft hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all">
                Find Nearest Mechanic
            </button>

            <BottomNav />
        </div>
    );
}
