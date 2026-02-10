"use client";

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: string;
    plate: string;
}

export default function DriverGaragePage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [form, setForm] = useState({ make: '', model: '', year: '', plate: '' });

    useEffect(() => {
        const stored = localStorage.getItem('driverVehicles');
        if (stored) {
            setVehicles(JSON.parse(stored));
        }
    }, []);

    const persist = (next: Vehicle[]) => {
        setVehicles(next);
        localStorage.setItem('driverVehicles', JSON.stringify(next));
    };

    const handleAdd = () => {
        if (!form.make || !form.model || !form.year) return;
        const newVehicle: Vehicle = {
            id: `${Date.now()}`,
            make: form.make,
            model: form.model,
            year: form.year,
            plate: form.plate
        };
        persist([newVehicle, ...vehicles]);
        setForm({ make: '', model: '', year: '', plate: '' });
    };

    const handleRemove = (id: string) => {
        persist(vehicles.filter((v) => v.id !== id));
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            <div className="px-6 pt-8 pb-4">
                <h1 className="text-2xl font-black text-text-main dark:text-white">My Garage</h1>
                <p className="text-sm text-text-sub dark:text-gray-400">Store your vehicles for faster requests.</p>
            </div>

            <div className="px-6 space-y-4">
                <div className="rounded-2xl bg-white dark:bg-card-dark p-4 shadow-soft border border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-3">Add Vehicle</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            placeholder="Make"
                            value={form.make}
                            onChange={(e) => setForm({ ...form, make: e.target.value })}
                        />
                        <input
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            placeholder="Model"
                            value={form.model}
                            onChange={(e) => setForm({ ...form, model: e.target.value })}
                        />
                        <input
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            placeholder="Year"
                            value={form.year}
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                        />
                        <input
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            placeholder="Plate"
                            value={form.plate}
                            onChange={(e) => setForm({ ...form, plate: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-glow hover:bg-primary/90"
                    >
                        Save Vehicle
                    </button>
                </div>

                <div className="space-y-3">
                    {vehicles.length === 0 ? (
                        <div className="text-center text-sm text-text-sub dark:text-gray-400 py-6">No vehicles saved yet.</div>
                    ) : (
                        vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="rounded-2xl bg-white dark:bg-card-dark p-4 shadow-soft border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-text-main dark:text-white">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                    <p className="text-xs text-text-sub dark:text-gray-400">{vehicle.plate || 'No plate'}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(vehicle.id)}
                                    className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
