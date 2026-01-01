'use client';

// Mock data
const formations = [
    { id: 1, name: 'Licence 1 - Computer Science', level: 'L1', dept: 'Computer Science', count: 450 },
    { id: 2, name: 'Licence 2 - Computer Science', level: 'L2', dept: 'Computer Science', count: 320 },
    { id: 3, name: 'Licence 3 - Computer Science', level: 'L3', dept: 'Computer Science', count: 280 },
    { id: 4, name: 'Master 1 - Software Engineering', level: 'M1', dept: 'Computer Science', count: 120 },
    { id: 5, name: 'Master 2 - Software Engineering', level: 'M2', dept: 'Computer Science', count: 95 },
    { id: 6, name: 'Licence 1 - Civil Engineering', level: 'L1', dept: 'Civil Engineering', count: 300 },
];

export default function FormationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Formations</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Formation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                    <div key={formation.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${formation.level.startsWith('L') ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                {formation.level}
                            </span>
                            <button className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{formation.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{formation.dept}</p>
                        <div className="flex items-center text-sm text-slate-600">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            {formation.count} Students
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
