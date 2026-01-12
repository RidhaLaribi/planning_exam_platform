'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface StatData {
    totalStudents: number;
    totalExams: number;
    totalRooms: number;
    totalUnscheduled: number;
    occupancyRate: number;
    examsByDept: { nom: string; count: number }[];
    unscheduledByReason: { reason: string; count: number }[];
}

export default function StatisticsPage() {
    const [data, setData] = useState<StatData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats')
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-slate-500">Loading statistics...</div>;
    if (!data) return <div className="p-8 text-slate-500">Failed to load data.</div>;

    const maxExams = Math.max(...data.examsByDept.map(d => d.count), 1); // Avoid div by zero

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Statistics & Analytics</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Room Utilization Rate</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">{data.occupancyRate}%</span>
                        <span className="text-sm text-slate-400 ml-2 mb-1">capacity usage</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(data.occupancyRate, 100)}%` }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Exams Scheduled</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">{data.totalExams}</span>
                        <span className="text-sm text-slate-400 ml-2 mb-1">total exams</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Unscheduled Exams</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">{data.totalUnscheduled}</span>
                        <span className="text-sm text-red-500 ml-2 mb-1">failures</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className={`h-2 rounded-full ${data.totalUnscheduled > 0 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Exams per Department</h3>
                    <div className="flex-1 flex items-end justify-between space-x-2 px-4">
                        {data.examsByDept.map((dept, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group flex flex-col justify-end h-full">
                                <div
                                    className="bg-blue-500 rounded-t-lg transition-all duration-500 w-full"
                                    style={{ height: `${(dept.count / maxExams) * 100}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {dept.count} exams
                                </div>
                                <div className="text-xs text-slate-500 mt-2 text-center truncate w-full" title={dept.nom}>
                                    {dept.nom.substring(0, 3)}
                                </div>
                            </div>
                        ))}
                        {data.examsByDept.length === 0 && <div className="text-slate-400 m-auto">No exams data</div>}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Unscheduled Distribution</h3>
                    <div className="space-y-4 overflow-y-auto">
                        {data.unscheduledByReason.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{item.reason}</span>
                                    <span className="text-slate-500">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((item.count / (data.totalUnscheduled || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {data.unscheduledByReason.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-slate-400">
                                No unscheduled exams.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
