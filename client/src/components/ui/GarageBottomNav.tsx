"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GarageBottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#21242c]/95 backdrop-blur-lg pb-safe">
            <div className="flex items-center justify-between px-6 py-3">
                <Link
                    href="/garage/dashboard"
                    className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/garage/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isActive('/garage/dashboard') ? 'font-variation-filled' : 'group-hover:scale-110'} transition-transform`}>
                        dashboard
                    </span>
                    <span className="text-[10px] font-bold tracking-wide">Home</span>
                </Link>

                <Link
                    href="/garage/auctions"
                    className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/garage/auctions') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isActive('/garage/auctions') ? 'font-variation-filled' : 'group-hover:scale-110'} transition-transform`}>
                        build_circle
                    </span>
                    <span className="text-[10px] font-bold tracking-wide">Repairs</span>
                </Link>

                <Link href="/garage/add">
                    <div className="relative -top-5 h-14 w-14 rounded-full bg-primary shadow-glow flex items-center justify-center text-white transition-transform active:scale-95 hover:scale-105 border-4 border-white dark:border-[#21242c]">
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </div>
                </Link>

                <Link
                    href="/garage/messages"
                    className={`flex flex-col items-center gap-1 transition-colors group ${isActive('/garage/messages') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isActive('/garage/messages') ? 'font-variation-filled' : 'group-hover:scale-110'} transition-transform`}>
                        chat_bubble
                    </span>
                    <span className="text-[10px] font-bold tracking-wide">Messages</span>
                </Link>

                {/* Profile Link Placeholder - Route doesn't exist yet but good to have for symmetry */}
                <button
                    className="flex flex-col items-center gap-1 transition-colors group text-gray-400 opacity-50 cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-2xl">person</span>
                    <span className="text-[10px] font-bold tracking-wide">Profile</span>
                </button>
            </div>
            <div className="h-4 w-full"></div>
        </div>
    );
}
