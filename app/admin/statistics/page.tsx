'use client';

export default function StatisticsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Statistics & Analytics</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Room Utilization Rate</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">85%</span>
                        <span className="text-sm text-green-600 ml-2 mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            +5%
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Exams Scheduled</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">142</span>
                        <span className="text-sm text-slate-400 ml-2 mb-1">total exams</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Conflicts Resolved</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-slate-800">12</span>
                        <span className="text-sm text-green-600 ml-2 mb-1">auto-resolved</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                </div>
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Exams per Department</h3>
                    <div className="flex-1 flex items-end justify-between space-x-2 px-4">
                        {[40, 65, 35, 50, 25, 45].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h} exams
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500 px-4">
                        <span>CS</span>
                        <span>EE</span>
                        <span>ME</span>
                        <span>CE</span>
                        <span>Math</span>
                        <span>Phys</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-80 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Conflict Distribution</h3>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                            <span className="text-xs text-slate-400">Chart Placeholder</span>
                            <svg className="absolute inset-0 w-full h-full text-blue-500 transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="200 289" />
                            </svg>
                            <svg className="absolute inset-0 w-full h-full text-purple-500 transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="50 289" strokeDashoffset="-200" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center text-xs text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            Time overlap
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                            Room capacity
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
