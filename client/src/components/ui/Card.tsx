"use client";

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft p-5 transition-all ${onClick ? 'cursor-pointer active:scale-[0.99] hover:shadow-lg' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
