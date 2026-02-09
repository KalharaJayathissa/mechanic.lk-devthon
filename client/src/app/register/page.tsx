"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialButton } from '@/components/ui/SocialButton';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'driver' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, role } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    if (data.role === 'garage-owner') {
                        router.push('/garage/dashboard');
                    } else if (data.role === 'parking-owner') {
                        router.push('/parking-owner/dashboard');
                    } else {
                        router.push('/driver/dashboard');
                    }
                } else {
                    router.push('/login');
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'driver', label: 'Driver', icon: 'directions_car', desc: 'I need services' },
        { id: 'garage-owner', label: 'Mechanic', icon: 'build', desc: 'I offer repairs' },
        { id: 'parking-owner', label: 'Parking', icon: 'local_parking', desc: 'I rent spots' },
    ];

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Left Side: Premium Branding */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gray-900 text-white p-12 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-black mb-8 leading-tight">Join the<br /> Revolution.</h1>

                    <div className="space-y-6">
                        <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined text-2xl">directions_car</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">For Drivers</h3>
                                <p className="text-sm text-gray-400">Find parking & mechanics instantly.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/30">
                                <span className="material-symbols-outlined text-2xl">storefront</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">For Business</h3>
                                <p className="text-sm text-gray-400">Grow your garage or parking lot.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-16 relative overflow-y-auto">
                <div className="w-full max-w-[480px] my-auto">
                    <div className="mb-8 ">
                        <h2 className="text-3xl font-black text-text-main dark:text-white mb-2">Create Account</h2>
                        <p className="text-text-sub dark:text-gray-400 text-lg">
                            Get started for free. No credit card required.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-3">
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

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r.id })}
                                    className={`
                                        p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200
                                        ${role === r.id
                                            ? 'border-primary bg-primary/5 text-primary shadow-glow ring-1 ring-primary/50'
                                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                    `}
                                >
                                    <span className={`material-symbols-outlined text-2xl ${role === r.id ? 'font-variation-filled' : ''}`}>{r.icon}</span>
                                    <span className="text-xs font-bold">{r.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                icon="person"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={onChange}
                                required
                            />
                            <Input
                                label="Email Address"
                                icon="mail"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={onChange}
                                required
                            />
                            <Input
                                label="Password"
                                icon="lock"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full !h-14 text-lg shadow-glow mt-2"
                            isLoading={loading}
                            rightIcon="arrow_forward"
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-10 text-center text-sm font-medium text-text-sub dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
