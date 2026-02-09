"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialButton } from '@/components/ui/SocialButton';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));

                // Role-based redirect
                if (data.role === 'garage-owner') {
                    router.push('/garage/dashboard');
                } else if (data.role === 'parking-owner') {
                    router.push('/parking-owner/dashboard');
                } else {
                    router.push('/driver/dashboard');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Left Side: Premium Branding */}
            <div className="hidden md:flex flex-col justify-center items-center bg-primary text-white p-12 relative">
                {/* Abstract Glassmorphism Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-400 opacity-20 blur-[100px]"></div>
                <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] rounded-full bg-white opacity-10 blur-[50px]"></div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="h-24 w-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center mb-8 border border-white/20 shadow-xl rotate-6 hover:rotate-0 transition-all duration-500">
                        <span className="material-symbols-outlined text-[48px]">car_repair</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 tracking-tight">Mechanic.LK</h1>
                    <p className="text-xl opacity-90 font-medium leading-relaxed">
                        Your all-in-one automotive ecosystem. Connect with mechanics, find parking, and get back on the road.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-16 relative">
                <div className="w-full max-w-[420px] relative z-10">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-black text-text-main dark:text-white mb-3">Welcome Back</h2>
                        <p className="text-text-sub dark:text-gray-400 text-lg">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-3 animate-pulse">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <SocialButton provider="google" />
                        <SocialButton provider="facebook" />
                    </div>

                    <div className="relative flex items-center gap-4 mb-8">
                        <div className="h-[1px] bg-gray-200 dark:bg-gray-800 flex-1"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                        <div className="h-[1px] bg-gray-200 dark:bg-gray-800 flex-1"></div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            icon="mail"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={onChange}
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                icon="lock"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={onChange}
                                required
                            />
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors mt-2">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-4 !h-14 text-lg shadow-glow"
                            isLoading={loading}
                            rightIcon="arrow_forward"
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-10 text-center text-sm font-medium text-text-sub dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
