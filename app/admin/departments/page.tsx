'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import AddDepartmentModal from '../../../components/AddDepartmentModal';
import EditDepartmentModal from '../../../components/EditDepartmentModal';

interface Department {
    id: number;
    nom: string;
    professeurs_count?: number;
    formations_count?: number;
    // head field is not in backend yet
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departements');
            setDepartments(res.data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this department?')) return;
        try {
            await api.delete(`/departements/${id}`);
            setDepartments(departments.filter(d => d.id !== id));
        } catch (error) {
            console.error("Failed to delete department", error);
            alert("Failed to delete department");
        }
    };

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (name: string) => {
        const res = await api.post('/departements', { nom: name });
        setDepartments([...departments, { ...res.data, professeurs_count: 0, formations_count: 0 }]);
    };

    const handleEdit = (dept: Department) => {
        setSelectedDepartment(dept);
        setIsEditModalOpen(true);
    };

    const handleUpdateDepartment = async (id: number, name: string) => {
        await api.put(`/departements/${id}`, { nom: name });
        await fetchDepartments(); // Refresh the list
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
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
                                <th className="px-6 py-4 font-semibold">Faculty Members</th>
                                <th className="px-6 py-4 font-semibold">Formations</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {departments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800 font-medium">{dept.nom}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {dept.professeurs_count || 0} members
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {dept.formations_count || 0} formations
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(dept)} className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(dept.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />

            <EditDepartmentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateDepartment}
                department={selectedDepartment}
            />
        </div>
    );
}
