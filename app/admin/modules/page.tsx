'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import AddModuleModal from '../../../components/AddModuleModal';
import EditModuleModal from '../../../components/EditModuleModal';

interface Module {
    id: number;
    nom: string;
    credits: number;
    formation?: {
        nom: string;
    };
    formation_id: number;
    pre_req_id?: number;
    code?: string; // Not in backend explicitly yet, will mock
}

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const fetchModules = async () => {
        try {
            const res = await api.get('/modules');
            setModules(res.data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this module?')) return;
        try {
            await api.delete(`/modules/${id}`);
            setModules(modules.filter(m => m.id !== id));
        } catch (error) {
            console.error("Failed to delete module", error);
            alert("Failed to delete module.");
        }
    };

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: { nom: string; credits: number; formation_id: number; pre_req_id?: number }) => {
        const res = await api.post('/modules', data);
        // Fetch modules again to get the full data with relationships
        await fetchModules();
    };

    const handleEdit = (module: Module) => {
        setSelectedModule(module);
        setIsEditModalOpen(true);
    };

    const handleUpdateModule = async (id: number, data: { nom: string; credits: number; formation_id: number; pre_req_id?: number }) => {
        await api.put(`/modules/${id}`, data);
        await fetchModules(); // Refresh the list
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Modules</h1>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Module
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Module Name</th>
                                <th className="px-6 py-4 font-semibold">Credits</th>
                                <th className="px-6 py-4 font-semibold">Formation</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {modules.map((module) => (
                                <tr key={module.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 bg-slate-50 w-24">
                                        {module.code || `MOD-${module.id}`}
                                    </td>
                                    <td className="px-6 py-4 text-slate-800 font-medium">{module.nom}</td>
                                    <td className="px-6 py-4 text-slate-600">{module.credits}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {module.formation?.nom || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(module)} className="text-slate-400 hover:text-blue-600 transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(module.id)} className="text-slate-400 hover:text-red-600 transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddModuleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />

            <EditModuleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateModule}
                module={selectedModule}
            />
        </div>
    );
}
