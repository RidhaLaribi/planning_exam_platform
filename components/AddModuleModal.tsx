'use client';

import { useState, useEffect } from 'react';
import api from '../lib/axios';

interface Formation {
    id: number;
    nom: string;
}

interface Module {
    id: number;
    nom: string;
}

interface AddModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { nom: string; credits: number; formation_id: number; pre_req_id?: number }) => Promise<void>;
}

export default function AddModuleModal({ isOpen, onClose, onSubmit }: AddModuleModalProps) {
    const [name, setName] = useState('');
    const [credits, setCredits] = useState('');
    const [formationId, setFormationId] = useState('');
    const [preReqId, setPreReqId] = useState('');

    const [formations, setFormations] = useState<Formation[]>([]);
    const [modules, setModules] = useState<Module[]>([]);

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [error, setError] = useState('');

    // Fetch formations and modules when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setFetchingData(true);
        try {
            const [formationsRes, modulesRes] = await Promise.all([
                api.get('/formations'),
                api.get('/modules')
            ]);
            setFormations(formationsRes.data);
            setModules(modulesRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load formations and modules');
        } finally {
            setFetchingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError('Module name is required');
            return;
        }

        const creditsNum = parseInt(credits);
        if (!credits || creditsNum < 1) {
            setError('Credits must be a positive number');
            return;
        }

        if (!formationId) {
            setError('Formation is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data: any = {
                nom: name.trim(),
                credits: creditsNum,
                formation_id: parseInt(formationId)
            };

            if (preReqId) {
                data.pre_req_id = parseInt(preReqId);
            }

            await onSubmit(data);
            resetForm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add module');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setCredits('');
        setFormationId('');
        setPreReqId('');
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
                        <h2 className="text-xl font-bold text-white">Add New Module</h2>
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
                    {fetchingData ? (
                        <div className="py-8 flex flex-col items-center justify-center text-slate-500">
                            <svg className="animate-spin h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </div>
                    ) : (
                        <>
                            {/* Module Name */}
                            <div>
                                <label htmlFor="module-name" className="block text-sm font-medium text-slate-700 mb-2">
                                    Module Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="module-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="e.g., Data Structures"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    autoFocus
                                />
                            </div>

                            {/* Credits */}
                            <div>
                                <label htmlFor="credits" className="block text-sm font-medium text-slate-700 mb-2">
                                    Credits <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="credits"
                                    type="number"
                                    min="1"
                                    value={credits}
                                    onChange={(e) => {
                                        setCredits(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="e.g., 3"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            {/* Formation Dropdown */}
                            <div>
                                <label htmlFor="formation" className="block text-sm font-medium text-slate-700 mb-2">
                                    Formation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="formation"
                                    value={formationId}
                                    onChange={(e) => {
                                        setFormationId(e.target.value);
                                        setError('');
                                    }}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                                >
                                    <option value="">Select a formation</option>
                                    {formations.map((formation) => (
                                        <option key={formation.id} value={formation.id}>
                                            {formation.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Prerequisite Module (Optional) */}
                            <div>
                                <label htmlFor="prerequisite" className="block text-sm font-medium text-slate-700 mb-2">
                                    Prerequisite Module <span className="text-slate-400 text-xs">(Optional)</span>
                                </label>
                                <select
                                    id="prerequisite"
                                    value={preReqId}
                                    onChange={(e) => setPreReqId(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                                >
                                    <option value="">None</option>
                                    {modules.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.nom}
                                        </option>
                                    ))}
                                </select>
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
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading || fetchingData}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || fetchingData}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                'Add Module'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
