'use client';

// Mock data
const modules = [
    { id: 1, name: 'Data Structures and Algorithms', code: 'CS201', credits: 4, formation: 'L2 Computer Science' },
    { id: 2, name: 'Database Systems', code: 'CS204', credits: 3, formation: 'L2 Computer Science' },
    { id: 3, name: 'Software Engineering', code: 'CS301', credits: 4, formation: 'L3 Computer Science' },
    { id: 4, name: 'Computer Networks', code: 'CS305', credits: 3, formation: 'L3 Computer Science' },
    { id: 5, name: 'Linear Algebra', code: 'MATH101', credits: 3, formation: 'L1 Computer Science' },
];

export default function ModulesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Modules</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Module
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Code</th>
                                <th className="px-6 py-4 font-semibold">Module Name</th>
                                <th className="px-6 py-4 font-semibold">Credits</th>
                                <th className="px-6 py-4 font-semibold">Formation</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {modules.map((module) => (
                                <tr key={module.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 bg-slate-50 w-24">{module.code}</td>
                                    <td className="px-6 py-4 text-slate-800 font-medium">{module.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{module.credits}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {module.formation}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors">Edit</button>
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
