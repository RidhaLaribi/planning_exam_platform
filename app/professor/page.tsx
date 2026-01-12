'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';


interface Exam {
    id: number;
    moduleName: string;
    profName: string;
    roomName: string;
    date: string;
    timeRange: string;
    isMyCourse: boolean;
}

export default function ProfessorPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                // Pass user_id for demonstration if needed, similar to student page
                const response = await api.get('/exams/professor');

                const formattedExams = response.data.data.map((e: any) => {
                    const dateObj = parseISO(e.date_heure);
                    const endTime = new Date(dateObj.getTime() + (e.duree_minutes * 60000));

                    return {
                        id: e.id,
                        moduleName: e.module.nom,
                        profName: e.prof ? e.prof.nom : 'Unknown',
                        roomName: e.salle.nom,
                        date: format(dateObj, 'MMM dd'),
                        timeRange: `${format(dateObj, 'HH:mm')} - ${format(endTime, 'HH:mm')}`,
                        isMyCourse: true // For now, all exams fetched for prof are his supervison
                    };
                });
                setExams(formattedExams);
            } catch (error) {
                console.error("Failed to fetch professor exams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const myExams = exams; // In this model, they are supervising these rooms
    const invigilationExams = []; // If we had separate logic for "Teaching" vs "Invigilating", we'd filter here.

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading schedule...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        PR
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Professor Portal</h1>
                        <p className="text-sm text-slate-500">My Supervision Schedule</p>
                    </div>
                </div>
                <button className="text-sm text-slate-600 hover:text-red-600 font-medium" onClick={handleLogout}>Logout</button>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Workload Indicator */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Exam Workload</h2>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-slate-600 w-24">Upcoming</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min(exams.length * 10, 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">{exams.length} exams</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Teaching Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden col-span-2 lg:col-span-1">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">My Supervision Schedule</h2>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">{myExams.length} Upcoming</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {myExams.length > 0 ? (
                                myExams.map(exam => (
                                    <div key={exam.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-800">{exam.moduleName}</h3>
                                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exam.date}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600 space-x-4">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {exam.timeRange}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {exam.roomName}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-400">No scheduled supervisions.</div>
                            )}
                        </div>
                    </div>

                    {/* Invigilation Schedule (Placeholder / Combined) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden col-span-2 lg:col-span-1 opacity-50">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Department Overview</h2>
                        </div>
                        <div className="p-6 text-center text-slate-400 text-sm">
                            Department overview not yet implemented.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
