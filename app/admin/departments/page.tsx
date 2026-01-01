'use client';

import { useState } from 'react';

// Mock data
const initialDepartments = [
    { id: 1, name: 'Computer Science', head: 'Dr. Sarah Smith', facultyCount: 45 },
    { id: 2, name: 'Electrical Engineering', head: 'Dr. James Chen', facultyCount: 32 },
    { id: 3, name: 'Mechanical Engineering', head: 'Dr. Michael Ross', facultyCount: 28 },
    { id: 4, name: 'Civil Engineering', head: 'Dr. Emily White', facultyCount: 24 },
    { id: 5, name: 'Mathematics', head: 'Dr. David Brown', facultyCount: 18 }, { id: 6, name: 'Mathematics', head: 'Dr. David Brown', facultyCount: 18 },
];

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState(initialDepartments);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
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
                            {departments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800 font-medium">{dept.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{dept.head}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {dept.facultyCount} members
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button className="text-slate-400 hover:text-red-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
