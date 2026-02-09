"use client";

import { ParkingBottomNav } from '@/components/ui/ParkingBottomNav';

export default function ParkingMessagesPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-black text-text-main dark:text-white">Messages</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-60">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">forum</span>
                <p className="text-lg font-bold text-text-main dark:text-white">No messages yet</p>
                <p className="text-sm text-text-sub dark:text-gray-400 max-w-xs mx-auto mt-2">
                    Inquiries from drivers about your parking spots will appear here.
                </p>
            </div>
            <ParkingBottomNav />
        </div>
    );
}
