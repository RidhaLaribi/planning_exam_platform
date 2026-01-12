'use client';

import { useState } from 'react';
import api from '../lib/axios';

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { nom: string; capacite: number; type: string; batiment: string }) => Promise<void>;
}

export default function AddRoomModal({ isOpen, onClose, onSubmit }: AddRoomModalProps) {
    const [nom, setNom] = useState('');
    const [capacite, setCapacite] = useState('');
    const [type, setType] = useState('Salle TD');
    const [batiment, setBatiment] = useState('Main Block');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nom.trim()) {
            setError('Room name is required');
            return;
        }

        const cap = parseInt(capacite);
        if (isNaN(cap) || cap <= 0) {
            setError('Valid capacity is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await onSubmit({
                nom: nom.trim(),
                capacite: cap,
                type,
                batiment
            });
            resetForm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNom('');
        setCapacite('');
        setType('Salle TD');
        setBatiment('Main Block');
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Add New Room</h2>
                        <button onClick={handleClose} disabled={loading} className="text-white/80 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Room Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="e.g. Salle 101"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Capacity <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            value={capacite}
                            onChange={(e) => setCapacite(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Salle TD">Salle TD</option>
                            <option value="Amphi">Amphi</option>
                            <option value="Laboratoire">Laboratoire</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Building</label>
                        <input
                            type="text"
                            value={batiment}
                            onChange={(e) => setBatiment(e.target.value)}
                            placeholder="e.g. Main Block"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={handleClose} disabled={loading} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center">
                            {loading ? 'Adding...' : 'Add Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
