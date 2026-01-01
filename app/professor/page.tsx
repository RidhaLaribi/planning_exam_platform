'use client';

// Denormalized Single List as requested
const examsList = [
    {
        id: 1,
        moduleName: 'CS101 - Intro to Programming',
        profName: 'Dr. Sarah Smith', // Me
        roomName: 'Amphi A',
        date: 'May 15',
        timeRange: '09:00 - 11:00',
        isMyCourse: true
    },
    {
        id: 2,
        moduleName: 'CS302 - Algorithms',
        profName: 'Dr. Sarah Smith', // Me
        roomName: 'Lab 3',
        date: 'May 19',
        timeRange: '14:00 - 17:00',
        isMyCourse: true
    },
    {
        id: 3,
        moduleName: 'MATH101 - Calculus I',
        profName: 'Prof. Miller',
        roomName: 'Room 102',
        date: 'May 16',
        timeRange: '08:30 - 11:30',
        isMyCourse: false // Invigilation
    },
    {
        id: 4,
        moduleName: 'PHYS202 - Electromagnetism',
        profName: 'Prof. Johnson',
        roomName: 'Amphi B',
        date: 'May 21',
        timeRange: '14:00 - 16:00',
        isMyCourse: false // Invigilation
    }
];

export default function ProfessorPage() {
    const myExams = examsList.filter(e => e.isMyCourse);
    const invigilationExams = examsList.filter(e => !e.isMyCourse);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        SS
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Dr. Sarah Smith</h1>
                        <p className="text-sm text-slate-500">Professor - Computer Science</p>
                    </div>
                </div>
                <button className="text-sm text-slate-600 hover:text-red-600 font-medium">Logout</button>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Workload Indicator */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Exam Workload</h2>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-slate-600 w-24">Today</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">0 exams</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-slate-600 w-24">Tomorrow</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">2 exams</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600 w-24">This Week</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">5 exams</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Teaching Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">My Exams (Teaching)</h2>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">{myExams.length} Upcoming</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {myExams.map(exam => (
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
                            ))}
                        </div>
                    </div>

                    {/* Invigilation Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">Invigilation Duties</h2>
                            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded">{invigilationExams.length} Assigned</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {invigilationExams.map(exam => (
                                <div key={exam.id} className="p-4 hover:bg-slate-50 transition-colors bg-purple-50/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{exam.moduleName}</h3>
                                            <p className="text-xs text-slate-500">{exam.profName}</p>
                                        </div>
                                        <span className="text-sm text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{exam.date}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600 space-x-4 mt-2">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {exam.timeRange}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {exam.roomName}
                                        </span>
                                        <span className="text-purple-600 text-xs font-medium ml-auto">Surveillance</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
