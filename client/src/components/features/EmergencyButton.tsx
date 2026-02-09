"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function EmergencyButton() {
    const [isActivating, setIsActivating] = useState(false);

    const handlePress = () => {
        setIsActivating(true);
        // TODO: Connect to backend socket / API
        setTimeout(() => {
            alert("Emergency Signal Broadcasted! Searching for nearby mechanics...");
            setIsActivating(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={handlePress}
                className={`
          relative w-48 h-48 rounded-full flex items-center justify-center
          bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)]
          transition-all duration-300 active:scale-95 group
          ${isActivating ? 'animate-pulse' : 'hover:scale-105'}
        `}
            >
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                <div className="flex flex-col items-center z-10">
                    <span className="material-symbols-outlined text-[64px] mb-2 drop-shadow-md">
                        sos
                    </span>
                    <span className="text-xl font-extrabold tracking-wider drop-shadow-md uppercase">
                        {isActivating ? 'Sending...' : 'Fck I\'m Stuck'}
                    </span>
                </div>
            </button>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center max-w-xs">
                Pressing this will instantly share your location with nearby mechanics.
            </p>
        </div>
    );
}
