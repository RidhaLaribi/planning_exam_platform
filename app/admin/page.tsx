'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/axios';

// Interfaces
interface DashboardStats {
    totalStudents: number;
    totalExams: number;
    totalRooms: number;
    conflicts: number;
}

interface Schedule {
    id: number;
    dept: string;
    semester: string;
    status: string;
    date: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalExams: 0,
        totalRooms: 0,
        conflicts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch counts concurrently
                const [studentsRes, examsRes, roomsRes, conflictsRes] = await Promise.all([
                    api.get('/etudiants'),
                    api.get('/examens'),
                    api.get('/lieu_examen'),
                    api.get('/examens/conflicts')
                ]);

                // Assuming standard Laravel pagination or collection response
                // If the API returns { data: [...], meta: { total: ... } } use meta.total
                // If it returns array, use length. Only verify after first test if formats differ.

                const getCount = (res: any) => res.data.meta?.total ?? res.data.length ?? res.data.total ?? 0;

                setStats({
                    totalStudents: getCount(studentsRes),
                    totalExams: getCount(examsRes),
                    totalRooms: getCount(roomsRes),
                    conflicts: conflictsRes.data.length ?? 0 // Conflicts likely returns array of conflicts
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const recentSchedules: Schedule[] = [
        { id: 1, dept: 'Computer Science', semester: 'Spring 2024', status: 'Published', date: 'Oct 24, 2024' },
        { id: 2, dept: 'Electrical Engineering', semester: 'Spring 2024', status: 'Draft', date: 'Oct 23, 2024' },
        { id: 3, dept: 'Civil Engineering', semester: 'Fall 2023', status: 'Archived', date: 'Jun 15, 2023' },
    ];

    if (loading) {
        return <div className="p-6 text-slate-500">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Students</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalStudents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Exams</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalExams}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 mr-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Rooms</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalRooms}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
                    <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Conflicts</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.conflicts}</p>
                    </div>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
                    <p className="text-slate-500 text-sm">Manage your exam schedules efficiently.</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Generate Exam Schedule
                </button>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Recent Exam Schedules</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Semester</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date Generated</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentSchedules.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-700 font-medium">{schedule.dept}</td>
                                    <td className="px-6 py-4 text-slate-600">{schedule.semester}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${schedule.status === 'Published' ? 'bg-green-100 text-green-800' :
                                            schedule.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {schedule.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{schedule.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                            {schedule.status === 'Published' ? 'View' : schedule.status === 'Draft' ? 'Edit' : 'History'}
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
