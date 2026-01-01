'use client';

import { useEffect, useState } from 'react';
import api from '../lib/axios';

interface Professor {
    id: number;
    nom: string;
    specialite: string;
    user?: {
        email: string;
    };
    departement?: {
        nom: string;
    };
    examens?: Array<{
        id: number;
        date: string;
        heure_debut: string;
        heure_fin: string;
        module: {
            nom: string;
        };
    }>;
}

interface ViewProfessorModalProps {
    isOpen: boolean;
    onClose: () => void;
    professorId: number | null;
}

export default function ViewProfessorModal({ isOpen, onClose, professorId }: ViewProfessorModalProps) {
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && professorId) {
            fetchProfessor();
        }
    }, [isOpen, professorId]);

    const fetchProfessor = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/professeurs/${professorId}`);
            setProfessor(res.data);
        } catch (err) {
            console.error('Failed to fetch professor:', err);
            setError('Failed to load professor details');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setProfessor(null);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Professor Profile</h2>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                            <svg className="animate-spin h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : professor ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 pb-6 border-b border-slate-200">
                                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                                    {professor.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{professor.nom}</h3>
                                    <p className="text-slate-500">{professor.user?.email || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Department</p>
                                    <p className="text-slate-800 font-medium">{professor.departement?.nom || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Specialty</p>
                                    <p className="text-slate-800 font-medium">{professor.specialite}</p>
                                </div>
                            </div>

                            {/* Exams Section */}
                            {professor.examens && professor.examens.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-3">Assigned Exams</h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {professor.examens.map((exam) => (
                                            <div key={exam.id} className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-slate-800">{exam.module.nom}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(exam.date).toLocaleDateString()} • {exam.heure_debut} - {exam.heure_fin}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {professor.examens && professor.examens.length === 0 && (
                                <div className="text-center py-6 text-slate-500">
                                    <svg className="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p>No exams assigned yet</p>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Close Button */}
                    <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
