'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format, parseISO } from 'date-fns';
import { Search, Filter, Download } from 'lucide-react';

interface Exam {
    id: number;
    moduleName: string;
    profName: string;
    roomName: string;
    roomCapacity: number;
    date: string;
    time: string;
    duration: number;
}

export default function AdminExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams/admin');
                const formatted = response.data.data.map((e: any) => ({
                    id: e.id,
                    moduleName: e.module ? e.module.nom : 'Unknown',
                    profName: e.prof ? e.prof.nom : 'Unassigned',
                    roomName: e.salle ? e.salle.nom : 'Unassigned',
                    roomCapacity: e.salle ? e.salle.capacite : 0,
                    date: format(parseISO(e.date_heure), 'yyyy-MM-dd'),
                    time: format(parseISO(e.date_heure), 'HH:mm'),
                    duration: e.duree_minutes
                }));
                setExams(formatted);
                setFilteredExams(formatted);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    useEffect(() => {
        // Filter logic
        const lowerSearch = search.toLowerCase();
        const filtered = exams.filter(e =>
            e.moduleName.toLowerCase().includes(lowerSearch) ||
            e.profName.toLowerCase().includes(lowerSearch) ||
            e.roomName.toLowerCase().includes(lowerSearch)
        );
        setFilteredExams(filtered);
    }, [search, exams]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading exams...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Exam Schedule (Overview)</h1>
                    <p className="text-slate-500 text-sm">Monitor all scheduled exams, rooms, and supervisors.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by module, professor, or room..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Module</th>
                                <th className="px-6 py-4 font-semibold">Room</th>
                                <th className="px-6 py-4 font-semibold">Supervisor</th>
                                <th className="px-6 py-4 font-semibold text-center">Duration</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 font-medium">{exam.date}</div>
                                            <div className="text-slate-500 text-sm">{exam.time}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{exam.moduleName}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800">{exam.roomName}</div>
                                            <div className="text-xs text-slate-400">Cap: {exam.roomCapacity}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {exam.profName === 'Unassigned' ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-medium">Pending</span>
                                            ) : (
                                                <span className="text-slate-700">{exam.profName}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600 text-sm">{exam.duration}m</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-blue-800 text-sm font-medium">Details</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        No exams found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4 text-center text-slate-400 text-sm">
                Showing {filteredExams.length} records
            </div>
        </div>
    );
}
