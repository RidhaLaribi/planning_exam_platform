'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import AddProfessorModal from '../../../components/AddProfessorModal';
import ViewProfessorModal from '../../../components/ViewProfessorModal';

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
}

export default function ProfessorsPage() {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(null);

    const fetchProfessors = async () => {
        try {
            const res = await api.get('/professeurs');
            setProfessors(res.data);
        } catch (error) {
            console.error("Failed to fetch professors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessors();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this professor?')) return;
        try {
            await api.delete(`/professeurs/${id}`);
            setProfessors(professors.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete professor", error);
            alert("Failed to delete professor.");
        }
    };

    const handleAddProfessor = async (data: { nom: string; dept_id: number; specialite: string; user_id: number }) => {
        const res = await api.post('/professeurs', data);
        await fetchProfessors(); // Refresh the list
    };

    const handleViewProfile = (id: number) => {
        setSelectedProfessorId(id);
        setIsViewModalOpen(true);
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Professors</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Professor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Specialty</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {professors.map((prof) => (
                                <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                            {prof.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-slate-800 font-medium">{prof.nom}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{prof.user?.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-600">{prof.departement?.nom || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-600">{prof.specialite}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleViewProfile(prof.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Profile</button>
                                        <button onClick={() => handleDelete(prof.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddProfessorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProfessor}
            />

            <ViewProfessorModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                professorId={selectedProfessorId}
            />
        </div>
    );
}
