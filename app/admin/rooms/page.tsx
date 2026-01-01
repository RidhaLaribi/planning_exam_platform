'use client';

// Mock data
const rooms = [
    { id: 1, name: 'Amphitheater A', capacity: 300, type: 'Amphitheater' },
    { id: 2, name: 'Amphitheater B', capacity: 250, type: 'Amphitheater' },
    { id: 3, name: 'Room 101', capacity: 40, type: 'Classroom' },
    { id: 4, name: 'Room 102', capacity: 40, type: 'Classroom' },
    { id: 5, name: 'Lab 1', capacity: 20, type: 'Laboratory' },
    { id: 6, name: 'Lab 2', capacity: 20, type: 'Laboratory' },
    { id: 7, name: 'Lab 3', capacity: 20, type: 'Laboratory' },
];

export default function RoomsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Rooms</h1>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${room.type === 'Amphitheater' ? 'bg-orange-50 text-orange-600' :
                                room.type === 'Laboratory' ? 'bg-purple-50 text-purple-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                {room.type === 'Amphitheater' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Capacity</p>
                                <p className="text-lg font-bold text-slate-800">{room.capacity}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">{room.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{room.type}</p>

                        <div className="mt-auto flex space-x-2 pt-4 border-t border-slate-50">
                            <button className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors">Edit</button>
                            <button className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
