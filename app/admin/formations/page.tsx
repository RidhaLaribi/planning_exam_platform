'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';

interface Department {
    id: number;
    nom: string;
}

interface Formation {
    id: number;
    nom: string;
    dept_id: number;
    nb_modules: number;
    created_at?: string;
    updated_at?: string;
    // Helper for UI if joined, but we might just have Dept ID. 
    // Ideally the API returns the department object or name?
    // If not, we map it using the fetched departments list.
}

export default function FormationsPage() {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Selection & Form Data
    const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
    const [formData, setFormData] = useState({ nom: '', dept_id: '', nb_modules: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const [fmtRes, deptRes] = await Promise.all([
                fetch('http://planning_exam.test/api/formations'),
                fetch('http://planning_exam.test/api/departements')
            ]);

            if (!fmtRes.ok || !deptRes.ok) throw new Error('Failed to fetch data');

            const fmtData = await fmtRes.json();
            const deptData = await deptRes.json();

            setFormations(Array.isArray(fmtData) ? fmtData : fmtData.data || []);
            setDepartments(Array.isArray(deptData) ? deptData : deptData.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get Department Name helper
    const getDeptName = (id: number) => departments.find(d => d.id === id)?.nom || 'Unknown Dept';

    // Handlers
    const handleAdd = async () => {
        try {
            const res = await fetch('http://planning_exam.test/api/formations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dept_id: parseInt(formData.dept_id),
                    nb_modules: parseInt(formData.nb_modules)
                }),
            });
            if (!res.ok) throw new Error('Failed to add');
            await fetchData();
            setIsAddOpen(false);
            setFormData({ nom: '', dept_id: '', nb_modules: '' });
        } catch (err) {
            console.error(err);
            alert('Error adding formation');
        }
    };

    const handleEdit = async () => {
        if (!selectedFormation) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/formations/${selectedFormation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dept_id: parseInt(formData.dept_id),
                    nb_modules: parseInt(formData.nb_modules)
                }),
            });
            if (!res.ok) throw new Error('Failed to update');
            await fetchData();
            setIsEditOpen(false);
            setSelectedFormation(null);
            setFormData({ nom: '', dept_id: '', nb_modules: '' });
        } catch (err) {
            console.error(err);
            alert('Error updating formation');
        }
    };

    const handleDelete = async () => {
        if (!selectedFormation) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/formations/${selectedFormation.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchData();
            setIsDeleteOpen(false);
            setSelectedFormation(null);
        } catch (err) {
            console.error(err);
            alert('Error deleting formation');
        }
    };

    const openEdit = (fmt: Formation) => {
        setSelectedFormation(fmt);
        setFormData({
            nom: fmt.nom,
            dept_id: fmt.dept_id.toString(),
            nb_modules: fmt.nb_modules.toString()
        });
        setIsEditOpen(true);
    };

    const openDelete = (fmt: Formation) => {
        setSelectedFormation(fmt);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Formations</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Formation
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : formations.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No formations found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formations.map((formation) => (
                        <div key={formation.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(formation)} className="text-slate-400 hover:text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => openDelete(formation)} className="text-slate-400 hover:text-red-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                    {formation.nom.split(' ')[0]}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{formation.nom}</h3>
                            <p className="text-sm text-slate-500 mb-4">{getDeptName(formation.dept_id)}</p>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="text-slate-400 mr-2">{formation.nb_modules} Modules</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Formation">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Formation Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                            placeholder="e.g. Licence 1 CS"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.dept_id}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dept_id: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Modules</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nb_modules}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nb_modules: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Formation</button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Formation">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Formation Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.dept_id}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dept_id: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Modules</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nb_modules}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nb_modules: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Formation">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{selectedFormation?.nom}</span>?</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
