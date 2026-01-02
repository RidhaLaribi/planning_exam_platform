'use client';

import { useState, useEffect } from 'react';

interface Room {
    id: number;
    nom: string;
    capacite: number;
    type: string;
    batiment?: string;
}

interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, data: { nom: string; capacite: number; type: string; batiment: string }) => Promise<void>;
    room: Room | null;
}

export default function EditRoomModal({ isOpen, onClose, onSubmit, room }: EditRoomModalProps) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [type, setType] = useState('');
    const [building, setBuilding] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && room) {
            setName(room.nom);
            setCapacity(room.capacite.toString());
            setType(room.type);
            setBuilding(room.batiment || '');
        }
    }, [isOpen, room]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError('Room name is required');
            return;
        }

        const capacityNum = parseInt(capacity);
        if (!capacity || capacityNum < 1) {
            setError('Capacity must be a positive number');
            return;
        }

        if (!type.trim()) {
            setError('Room type is required');
            return;
        }

        if (!building.trim()) {
            setError('Building is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (room) {
                await onSubmit(room.id, {
                    nom: name.trim(),
                    capacite: capacityNum,
                    type: type.trim(),
                    batiment: building.trim()
                });
            }
            resetForm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update room');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setCapacity('');
        setType('');
        setBuilding('');
        setError('');
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Edit Room</h2>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Room Name */}
                    <div>
                        <label htmlFor="room-name" className="block text-sm font-medium text-slate-700 mb-2">
                            Room Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="room-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., Salle 101"
                            disabled={loading}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                            autoFocus
                        />
                    </div>

                    {/* Capacity */}
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-2">
                            Capacity <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="capacity"
                            type="number"
                            min="1"
                            value={capacity}
                            onChange={(e) => {
                                setCapacity(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., 50"
                            disabled={loading}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                        >
                            <option value="">Select room type</option>
                            <option value="Classroom">Classroom</option>
                            <option value="Amphitheater">Amphitheater</option>
                            <option value="Laboratory">Laboratory</option>
                        </select>
                    </div>

                    {/* Building */}
                    <div>
                        <label htmlFor="building" className="block text-sm font-medium text-slate-700 mb-2">
                            Building <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="building"
                            type="text"
                            value={building}
                            onChange={(e) => {
                                setBuilding(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., Main Block, Building A"
                            disabled={loading}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
