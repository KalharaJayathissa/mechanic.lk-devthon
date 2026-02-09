"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

export function ParkingMap() {
    return (
        <div className="relative h-full w-full bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-3xl">
            {/* Background Map Image - Placeholder */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0oSNCo8tjH6dj91y6Xhh1PT2mw2ANI5sq6gwnQaRCtdP5Xnz58-3PzrKSQl4tHo41nmgfzT2vIVl9RvOHg_2IMlKMEzvIVK5OqHQ_T7X7NXYj3sX-brmLj0NcaeRE-MHDIyiQZvKIgdQoyHDlbsOpJXVIvLhjO0K842T8WtQNmBguLxf70dtfXRBc-UI4XM1Aa-CyvW8lbVH5-KIWdlu6xD98hOQiGAqGrx_v4nKHNutUHw_CpHxNCNDuUV2wrmabUUnFwyG0az4')" }}
            ></div>

            {/* Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[35%] left-[20%] pointer-events-auto transform hover:scale-110 transition-transform">
                    <div className="bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-lg flex flex-col items-center border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-extrabold text-gray-900 dark:text-white">$8/hr</span>
                    </div>
                    <div className="w-2 h-2 bg-white dark:bg-surface-dark rotate-45 mx-auto -mt-1 shadow-sm"></div>
                </div>

                <div className="absolute top-[48%] right-[30%] pointer-events-auto transform hover:scale-110 transition-transform">
                    <div className="bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-lg flex flex-col items-center border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-extrabold text-gray-900 dark:text-white">$6/hr</span>
                    </div>
                    <div className="w-2 h-2 bg-white dark:bg-surface-dark rotate-45 mx-auto -mt-1 shadow-sm"></div>
                </div>
            </div>

            {/* Floating Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-200 shadow-lg">
                    <span className="material-symbols-outlined">my_location</span>
                </Button>
            </div>
        </div>
    );
}
