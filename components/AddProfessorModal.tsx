'use client';

import { useState, useEffect } from 'react';
import api from '../lib/axios';

interface Department {
    id: number;
    nom: string;
}

interface User {
    id: number;
    email: string;
}

interface AddProfessorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { nom: string; dept_id: number; specialite: string; user_id: number }) => Promise<void>;
}

export default function AddProfessorModal({ isOpen, onClose, onSubmit }: AddProfessorModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deptId, setDeptId] = useState('');
    const [specialite, setSpecialite] = useState('');

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        setFetchingData(true);
        try {
            const res = await api.get('/departements');
            setDepartments(res.data);
        } catch (err) {
            console.error('Failed to fetch departments:', err);
            setError('Failed to load departments');
        } finally {
            setFetchingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError('Professor name is required');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            setError('Valid email is required');
            return;
        }

        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!deptId) {
            setError('Department is required');
            return;
        }

        if (!specialite.trim()) {
            setError('Specialty is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // First create user account
            const userRes = await api.post('/users', {
                email: email.trim(),
                password: password,
                role: 'professeur'
            });

            // Then create professor with user_id
            await onSubmit({
                nom: name.trim(),
                dept_id: parseInt(deptId),
                specialite: specialite.trim(),
                user_id: userRes.data.id
            });

            resetForm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add professor');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setDeptId('');
        setSpecialite('');
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
                        <h2 className="text-xl font-bold text-white">Add New Professor</h2>
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
                            {/* Professor Name */}
                            <div>
                                <label htmlFor="prof-name" className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="prof-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="e.g., Dr. John Smith"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    autoFocus
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="prof-email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="prof-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="e.g., john.smith@university.edu"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="prof-password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="prof-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Minimum 6 characters"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="department"
                                    value={deptId}
                                    onChange={(e) => {
                                        setDeptId(e.target.value);
                                        setError('');
                                    }}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                                >
                                    <option value="">Select a department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Specialty */}
                            <div>
                                <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-2">
                                    Specialty <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="specialty"
                                    type="text"
                                    value={specialite}
                                    onChange={(e) => {
                                        setSpecialite(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="e.g., Machine Learning, Databases"
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
                                'Add Professor'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
