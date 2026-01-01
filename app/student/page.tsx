'use client';

import { useState } from 'react';

// Denormalized single list
const examsList = [
    {
        id: 1,
        moduleName: 'CS101 - Intro to Programming',
        profName: 'Dr. Sarah Smith',
        roomName: 'Amphi A',
        day: '15',
        month: 'May',
        weekday: 'Wed',
        date: '2024-05-15', // For filtering
        timeRange: '09:00 - 11:00',
        status: 'Upcoming'
    },
    {
        id: 2,
        moduleName: 'CS102 - Web Basics',
        profName: 'Prof. Johnson',
        roomName: 'Lab 1',
        day: '18',
        month: 'May',
        weekday: 'Sat',
        date: '2024-05-18',
        timeRange: '14:00 - 16:00',
        status: 'Upcoming'
    },
    {
        id: 3,
        moduleName: 'MATH101 - Calculus I',
        profName: 'Prof. Miller',
        roomName: 'Amphi B',
        day: '20',
        month: 'May',
        weekday: 'Mon',
        date: '2024-05-20',
        timeRange: '09:00 - 12:00',
        status: 'Upcoming'
    },
    {
        id: 4,
        moduleName: 'PHYS101 - Mechanics',
        profName: 'Prof. Johnson',
        roomName: 'Room 101',
        day: '22',
        month: 'May',
        weekday: 'Wed',
        date: '2024-05-22',
        timeRange: '14:00 - 16:00',
        status: 'Upcoming'
    },
    {
        id: 5,
        moduleName: 'ENG101 - Technical English',
        profName: 'Prof. Miller',
        roomName: 'Room 102',
        day: '25',
        month: 'May',
        weekday: 'Sat',
        date: '2024-05-25',
        timeRange: '10:00 - 11:30',
        status: 'Upcoming'
    }
];

export default function StudentPage() {
    const [filterDate, setFilterDate] = useState('');

    const filteredExams = filterDate
        ? examsList.filter(exam => exam.date === filterDate)
        : examsList;

    // Mock countdown for the first exam
    const nextExam = examsList[0];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        JM
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">John Miller</h1>
                        <p className="text-sm text-slate-500">Student - L1 Computer Science</p>
                    </div>
                </div>
                <button className="text-sm text-slate-600 hover:text-red-600 font-medium">Logout</button>
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
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
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
                                    <div className="bg-blue-50 md:w-32 flex flex-col items-center justify-center p-4 border-r border-slate-100">
                                        <span className="text-blue-600 font-bold text-lg">{exam.day}</span>
                                        <span className="text-blue-500 text-sm font-medium uppercase">{exam.month}</span>
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
                                <p className="text-slate-500">No exams found for this date.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Summary / Countdown */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Summary</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Next Exam</h3>
                            <p className="text-xl font-bold text-slate-800">{nextExam?.moduleName || 'None'}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">14</div>
                                    <div className="text-xs text-slate-500 uppercase">Days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">08</div>
                                    <div className="text-xs text-slate-500 uppercase">Hours</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">30</div>
                                    <div className="text-xs text-slate-500 uppercase">Mins</div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">My Stats</h3>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600">Total Exams</span>
                                    <span className="font-medium text-slate-800">{examsList.length}</span>
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
