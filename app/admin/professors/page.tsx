'use client';

// Mock data
const professors = [
    { id: 1, name: 'Dr. Sarah Smith', email: 'sarah.smith@univ.edu', department: 'Computer Science', specialty: 'AI & Data Science' },
    { id: 2, name: 'Dr. James Chen', email: 'james.chen@univ.edu', department: 'Electrical Engineering', specialty: 'Control Systems' },
    { id: 3, name: 'Dr. Michael Ross', email: 'michael.ross@univ.edu', department: 'Mechanical Engineering', specialty: 'Thermodynamics' },
    { id: 4, name: 'Dr. Emily White', email: 'emily.white@univ.edu', department: 'Civil Engineering', specialty: 'Structural Engineering' },
];

export default function ProfessorsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Professors</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Professor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Specialty</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {professors.map((prof) => (
                                <tr key={prof.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                            {prof.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <span className="text-slate-800 font-medium">{prof.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{prof.email}</td>
                                    <td className="px-6 py-4 text-slate-600">{prof.department}</td>
                                    <td className="px-6 py-4 text-slate-600">{prof.specialty}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Profile</button>
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
