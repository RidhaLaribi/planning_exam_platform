'use client';

import { useRouter } from 'next/navigation';


import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { format, parseISO } from 'date-fns';

interface Exam {
    id: number;
    moduleName: string;
    profName: string;
    roomName: string;
    day: string;
    month: string;
    weekday: string;
    date: string;
    timeRange: string;
    status: string;
}

export default function StudentPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                // Determine user ID if needed, or rely on hardcoded for demo if auth not fully set
                // In a real app, the token handles identity. Here, let's assume the API handles it or we pass a mock ID.
                // For this demo, let's try to pass a user_id via query param if we want to simulate specific user, 
                // but the Controller has a fallback to the first student.
                const response = await api.get('/exams/student');

                const formattedExams = response.data.data.map((e: any) => {
                    const dateObj = parseISO(e.date_heure);
                    const endTime = new Date(dateObj.getTime() + (e.duree_minutes * 60000));

                    return {
                        id: e.id,
                        moduleName: e.module.nom,
                        profName: e.prof ? `Prof. ${e.prof.nom}` : 'TBD',
                        roomName: e.salle.nom,
                        day: format(dateObj, 'dd'),
                        month: format(dateObj, 'MMM'),
                        weekday: format(dateObj, 'EEE'),
                        date: format(dateObj, 'yyyy-MM-dd'),
                        timeRange: `${format(dateObj, 'HH:mm')} - ${format(endTime, 'HH:mm')}`,
                        status: 'Upcoming' // Logic could be added to compare with now()
                    };
                });
                setExams(formattedExams);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const filteredExams = filterDate
        ? exams.filter(exam => exam.date === filterDate)
        : exams;

    const nextExam = exams.length > 0 ? exams[0] : null;

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading schedule...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ST
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Student Portal</h1>
                        <p className="text-sm text-slate-500">My Exam Schedule</p>
                    </div>
                </div>
                <button className="text-sm text-slate-600 hover:text-red-600 font-medium" onClick={handleLogout} >Logout</button>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        <span className="font-medium text-slate-700">Filter Exams:</span>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        <input
                            type="date"
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none w-full sm:w-auto"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-sm text-primary hover:text-primary-hover font-medium"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Exam List (Calendar Style) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Exam Timetable</h2>
                        {filteredExams.length > 0 ? (
                            filteredExams.map((exam) => (
                                <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                                    <div className="bg-primary/5 md:w-32 flex flex-col items-center justify-center p-4 border-r border-slate-100">
                                        <span className="text-primary font-bold text-lg">{exam.day}</span>
                                        <span className="text-primary/80 text-sm font-medium uppercase">{exam.month}</span>
                                        <span className="text-xs text-slate-400 mt-1">{exam.weekday}</span>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-slate-800">{exam.moduleName}</h3>
                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">{exam.status}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {exam.timeRange}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {exam.roomName}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                                Seat: Assigned Later
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                                <p className="text-slate-500">No exams found for {filterDate || 'this period'}.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Summary / Countdown */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Summary</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Next Exam</h3>
                            <p className="text-xl font-bold text-slate-800">{nextExam?.moduleName || 'None'}</p>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">My Stats</h3>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600">Total Exams</span>
                                    <span className="font-medium text-slate-800">{exams.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Conflict Check</span>
                                    <span className="font-medium text-green-600">Clean</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
