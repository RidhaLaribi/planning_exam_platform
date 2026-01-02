'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';

interface Formation {
    id: number;
    nom: string;
}

interface Module {
    id: number;
    nom: string;
    credits: number;
    formation_id: number;
    created_at?: string;
    updated_at?: string;
}

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [formations, setFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Selection & Form Data
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [formData, setFormData] = useState({ nom: '', credits: '', formation_id: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const [modRes, fmtRes] = await Promise.all([
                fetch('http://planning_exam.test/api/modules'),
                fetch('http://planning_exam.test/api/formations')
            ]);

            if (!modRes.ok || !fmtRes.ok) throw new Error('Failed to fetch data');

            const modData = await modRes.json();
            const fmtData = await fmtRes.json();

            setModules(Array.isArray(modData) ? modData : modData.data || []);
            setFormations(Array.isArray(fmtData) ? fmtData : fmtData.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper
    const getFormationName = (id: number) => formations.find(f => f.id === id)?.nom || 'Unknown Formation';

    // Handlers
    const handleAdd = async () => {
        try {
            const res = await fetch('http://planning_exam.test/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    credits: parseInt(formData.credits),
                    formation_id: parseInt(formData.formation_id)
                }),
            });
            if (!res.ok) throw new Error('Failed to add');
            await fetchData();
            setIsAddOpen(false);
            setFormData({ nom: '', credits: '', formation_id: '' });
        } catch (err) {
            console.error(err);
            alert('Error adding module');
        }
    };

    const handleEdit = async () => {
        if (!selectedModule) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/modules/${selectedModule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    credits: parseInt(formData.credits),
                    formation_id: parseInt(formData.formation_id)
                }),
            });
            if (!res.ok) throw new Error('Failed to update');
            await fetchData();
            setIsEditOpen(false);
            setSelectedModule(null);
            setFormData({ nom: '', credits: '', formation_id: '' });
        } catch (err) {
            console.error(err);
            alert('Error updating module');
        }
    };

    const handleDelete = async () => {
        if (!selectedModule) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/modules/${selectedModule.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchData();
            setIsDeleteOpen(false);
            setSelectedModule(null);
        } catch (err) {
            console.error(err);
            alert('Error deleting module');
        }
    };

    const openEdit = (mod: Module) => {
        setSelectedModule(mod);
        setFormData({
            nom: mod.nom,
            credits: mod.credits.toString(),
            formation_id: mod.formation_id.toString()
        });
        setIsEditOpen(true);
    };

    const openDelete = (mod: Module) => {
        setSelectedModule(mod);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Modules</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
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
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : modules.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">No modules found</td></tr>
                            ) : (
                                modules.map((module) => (
                                    <tr key={module.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-800 font-medium">{module.nom}</td>
                                        <td className="px-6 py-4 text-slate-600">{module.credits}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {getFormationName(module.formation_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => openEdit(module)} className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => openDelete(module)} className="text-slate-400 hover:text-red-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Module">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                            placeholder="e.g. Data Structures"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.credits}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, credits: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.formation_id}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, formation_id: e.target.value })}
                        >
                            <option value="">Select Formation</option>
                            {formations.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Module</button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Module">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.credits}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, credits: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.formation_id}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, formation_id: e.target.value })}
                        >
                            <option value="">Select Formation</option>
                            {formations.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Module">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{selectedModule?.nom}</span>?</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
