"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: string;
    rightIcon?: string;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: ButtonProps) {

    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
        primary: 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90',
        secondary: 'bg-secondary text-white shadow-lg shadow-secondary/25 hover:bg-secondary/90',
        outline: 'border-2 border-primary text-primary hover:bg-primary/5',
        ghost: 'text-text-sub hover:bg-gray-100 dark:hover:bg-gray-800',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10 p-0'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
                <>
                    {leftIcon && <span className="material-symbols-outlined mr-2 text-[20px]">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="material-symbols-outlined ml-2 text-[20px]">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}
