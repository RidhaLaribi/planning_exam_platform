'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import AddFormationModal from '../../../components/AddFormationModal';

interface Formation {
    id: number;
    nom: string;
    dept_id: number;
    nb_modules: number;
    departement?: {
        nom: string;
    };
}

export default function FormationsPage() {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFormations = async () => {
        try {
            const res = await api.get('/formations');
            setFormations(res.data);
        } catch (error) {
            console.error("Failed to fetch formations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormations();
    }, []);

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: { nom: string; dept_id: number; nb_modules: number }) => {
        await api.post('/formations', data);
        await fetchFormations(); // Refresh the list
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Formations</h1>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Formation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                    <div key={formation.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                {formation.nom.includes('Master') ? 'M' : 'L'}
                            </span>
                            <button className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{formation.nom}</h3>
                        <p className="text-sm text-slate-500 mb-4">{formation.departement?.nom || 'N/A'}</p>
                        <div className="flex items-center text-sm text-slate-600">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            {formation.nb_modules} Modules
                        </div>
                    </div>
                ))}
            </div>


            <AddFormationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}
