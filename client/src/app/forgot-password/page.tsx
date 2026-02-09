"use client";

import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 bg-background-light dark:bg-background-dark place-items-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 text-center">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>

                <h1 className="text-2xl font-black text-text-main dark:text-white mb-2">Reset Password</h1>
                <p className="text-text-sub dark:text-gray-400 mb-8">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>

                <form className="space-y-4">
                    <div className="text-left">
                        <label className="text-sm font-bold text-text-main dark:text-white ml-1 block mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-800 p-4 text-base font-medium text-text-main dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-glow hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        Send Instructions
                    </button>
                </form>

                <div className="mt-8">
                    <Link href="/login" className="text-sm font-bold text-text-sub dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
