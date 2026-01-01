'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import EditRoomModal from '../../../components/EditRoomModal';

interface Room {
    id: number;
    nom: string;
    capacite: number;
    type: string;
    batiment?: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const fetchRooms = async () => {
        try {
            const res = await api.get('/lieu_examen');
            setRooms(res.data);
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this room?')) return;
        try {
            await api.delete(`/lieu_examen/${id}`);
            setRooms(rooms.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete room", error);
            alert("Failed to delete room. It might be linked to exams.");
        }
    };

    const handleAdd = async () => {
        const name = prompt("Enter room name (e.g., Salle 101):");
        if (!name) return;
        const capacity = prompt("Enter capacity (e.g., 50):");
        if (!capacity) return;
        const type = prompt("Enter type (Amphitheater, Classroom, Laboratory):", "Classroom");
        if (!type) return;

        try {
            const res = await api.post('/lieu_examen', {
                nom: name,
                capacite: parseInt(capacity),
                type: type,
                batiment: 'Main Block' // Default for now
            });
            setRooms([...rooms, res.data]);
        } catch (error) {
            console.error("Failed to add room", error);
            alert("Failed to add room");
        }
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };

    const handleUpdateRoom = async (id: number, data: { nom: string; capacite: number; type: string; batiment: string }) => {
        await api.put(`/lieu_examen/${id}`, data);
        await fetchRooms(); // Refresh the list
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Rooms</h1>
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${room.type?.toLowerCase().includes('amphi') ? 'bg-orange-50 text-orange-600' :
                                room.type?.toLowerCase().includes('lab') ? 'bg-purple-50 text-purple-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                {room.type?.toLowerCase().includes('amphi') ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Capacity</p>
                                <p className="text-lg font-bold text-slate-800">{room.capacite}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">{room.nom}</h3>
                        <p className="text-sm text-slate-500 mb-4">{room.type}</p>

                        <div className="mt-auto flex space-x-2 pt-4 border-t border-slate-50">
                            <button onClick={() => handleEdit(room)} className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors">Edit</button>
                            <button onClick={() => handleDelete(room.id)} className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <EditRoomModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateRoom}
                room={selectedRoom}
            />
        </div>
    );
}
