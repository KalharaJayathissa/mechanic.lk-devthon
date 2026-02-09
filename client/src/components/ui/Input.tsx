"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
    error?: string;
}

export function Input({ label, icon, error, className = '', ...props }: InputProps) {
    return (
        <div className={`group relative ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-4 flex items-center justify-center text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                )}
                <input
                    className={`
            w-full bg-surface-light dark:bg-surface-dark text-text-main dark:text-white 
            placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-xl border-2 
            border-transparent focus:border-primary/20 hover:bg-white dark:hover:bg-[#1f2f36] 
            transition-all duration-200 outline-none shadow-sm focus:shadow-glow
            ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 text-base font-medium
            ${error ? 'border-red-500 focus:border-red-500' : ''}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
}
