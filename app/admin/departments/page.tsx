'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';

interface Department {
    id: number;
    nom: string;
    created_at?: string;
    updated_at?: string;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Selection state
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({ nom: '' });

    // Fetch Departments
    const fetchDepartments = async () => {
        try {
            const res = await fetch('http://planning_exam.test/api/departements');
            if (!res.ok) throw new Error('Failed to fetch departments');
            const data = await res.json();
            // Expected data format from Laravel resource: { data: [...] } or just [...]
            // Adjust based on Laravel's default apiResource response which is usually wrapped in data if using Resources, or direct if not.
            // Let's assume standard Laravel Resource collection wrapping or verify. 
            // Default `Route::apiResource` returns direct JSON array if return value is `Department::all()`, 
            // but if using `DepartmentResource::collection`, it wraps in `data`. 
            // I'll check response type or code defensively.
            setDepartments(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError('Error loading departments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Handlers
    const handleAdd = async () => {
        try {
            const res = await fetch('http://planning_exam.test/api/departements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to add department');
            await fetchDepartments();
            setIsAddOpen(false);
            setFormData({ nom: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add department');
        }
    };

    const handleEdit = async () => {
        if (!selectedDept) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/departements/${selectedDept.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to update department');
            await fetchDepartments();
            setIsEditOpen(false);
            setSelectedDept(null);
            setFormData({ nom: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to update department');
        }
    };

    const handleDelete = async () => {
        if (!selectedDept) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/departements/${selectedDept.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete department');
            await fetchDepartments();
            setIsDeleteOpen(false);
            setSelectedDept(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete department');
        }
    };

    const openEdit = (dept: Department) => {
        setSelectedDept(dept);
        setFormData({ nom: dept.nom });
        setIsEditOpen(true);
    };

    const openDelete = (dept: Department) => {
        setSelectedDept(dept);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Department
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Department Name</th>
                                <th className="px-6 py-4 font-semibold">Head of Department</th>
                                <th className="px-6 py-4 font-semibold">Faculty Members</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : departments.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">No departments found</td></tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-800 font-medium">{dept.nom}</td>
                                        <td className="px-6 py-4 text-slate-600">N/A</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                0 members
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => openEdit(dept)} className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => openDelete(dept)} className="text-slate-400 hover:text-red-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Department">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Department</button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Department">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Department">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{selectedDept?.nom}</span>? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
