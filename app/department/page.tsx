'use client';

import { useState } from 'react';

// Denormalized Single List as requested
const examsList = [
    {
        id: 1,
        moduleName: 'CS101 - Intro to Programming',
        profName: 'Dr. Smith',
        roomName: 'Amphi A',
        date: '5/15/2024',
        timeRange: '09:00 AM - 11:00 AM',
        duration: 120,
        status: 'Confirmed'
    },
    {
        id: 2,
        moduleName: 'MATH201 - Discrete Math',
        profName: 'Dr. Brown',
        roomName: 'Amphi B',
        date: '5/16/2024',
        timeRange: '02:00 PM - 04:00 PM',
        duration: 120,
        status: 'Confirmed'
    },
    {
        id: 3,
        moduleName: 'CS305 - Web Development',
        profName: 'Prof. Johnson',
        roomName: 'Lab 1 & 2',
        date: '5/18/2024',
        timeRange: '09:00 AM - 12:00 PM',
        duration: 180,
        status: 'Pending'
    }
];

export default function DepartmentPage() {
    const [isValidated, setIsValidated] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Computer Science Department</h1>
                        <p className="text-sm text-slate-500">Head of Department: Dr. Sarah Smith</p>
                    </div>
                </div>
                <button className="text-sm text-slate-600 hover:text-red-600 font-medium">Logout</button>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase">Total Exams</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{examsList.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase">Pending Validation</h3>
                        <p className="text-3xl font-bold text-orange-600 mt-2">1</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 uppercase">Department Conflicts</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">2</p>
                    </div>
                </div>

                {/* Conflicts Section */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-lg font-medium text-red-800">Attention Required: 2 Conflicts Detected</h3>
                            <div className="mt-4 space-y-3">
                                <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-red-700">CS201 - Data Structures</span>
                                        <span className="text-slate-600 text-sm ml-2">Overlaps with MATH202 for L2 Students</span>
                                    </div>
                                    <button className="text-sm font-medium text-red-600 hover:text-red-800">Resolve</button>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-red-700">Room 101 Overbooking</span>
                                        <span className="text-slate-600 text-sm ml-2">Assigned to both CS305 and SE401 at 10:00 AM</span>
                                    </div>
                                    <button className="text-sm font-medium text-red-600 hover:text-red-800">Resolve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exam Schedule Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Spring 2024 Exam Schedule</h2>
                        <button
                            onClick={() => setIsValidated(true)}
                            disabled={isValidated}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${isValidated ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {isValidated ? (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Validated
                                </>
                            ) : (
                                'Validate Schedule'
                            )}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Module</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Time</th>
                                    <th className="px-6 py-4 font-semibold">Room</th>
                                    <th className="px-6 py-4 font-semibold">Supervisor</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {examsList.map((exam) => {
                                    return (
                                        <tr key={exam.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{exam.moduleName}</td>
                                            <td className="px-6 py-4 text-slate-600">{exam.date}</td>
                                            <td className="px-6 py-4 text-slate-600">{exam.timeRange} ({exam.duration}m)</td>
                                            <td className="px-6 py-4 text-slate-600">{exam.roomName}</td>
                                            <td className="px-6 py-4 text-slate-600">{exam.profName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${exam.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {exam.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
