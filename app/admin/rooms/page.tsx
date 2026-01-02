'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';

interface Room {
    id: number;
    nom: string;
    capacite: number;
    type: string;
    batiment: string;
    created_at?: string;
    updated_at?: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Selection & Form Data
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState({ nom: '', capacite: '', type: '', batiment: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://planning_exam.test/api/lieu_examen');
            if (!res.ok) throw new Error('Failed to fetch rooms');
            const data = await res.json();
            setRooms(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleAdd = async () => {
        try {
            const res = await fetch('http://planning_exam.test/api/lieu_examen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    capacite: parseInt(formData.capacite)
                }),
            });
            if (!res.ok) throw new Error('Failed to add');
            await fetchData();
            setIsAddOpen(false);
            setFormData({ nom: '', capacite: '', type: '', batiment: '' });
        } catch (err) {
            console.error(err);
            alert('Error adding room');
        }
    };

    const handleEdit = async () => {
        if (!selectedRoom) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/lieu_examen/${selectedRoom.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    capacite: parseInt(formData.capacite)
                }),
            });
            if (!res.ok) throw new Error('Failed to update');
            await fetchData();
            setIsEditOpen(false);
            setSelectedRoom(null);
            setFormData({ nom: '', capacite: '', type: '', batiment: '' });
        } catch (err) {
            console.error(err);
            alert('Error updating room');
        }
    };

    const handleDelete = async () => {
        if (!selectedRoom) return;
        try {
            const res = await fetch(`http://planning_exam.test/api/lieu_examen/${selectedRoom.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchData();
            setIsDeleteOpen(false);
            setSelectedRoom(null);
        } catch (err) {
            console.error(err);
            alert('Error deleting room');
        }
    };

    const openEdit = (room: Room) => {
        setSelectedRoom(room);
        setFormData({
            nom: room.nom,
            capacite: room.capacite.toString(),
            type: room.type,
            batiment: room.batiment
        });
        setIsEditOpen(true);
    };

    const openDelete = (room: Room) => {
        setSelectedRoom(room);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Rooms</h1>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Room
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No rooms found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${room.type === 'Amphitheater' ? 'bg-orange-50 text-orange-600' :
                                        room.type === 'Laboratory' ? 'bg-purple-50 text-purple-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Capacity</p>
                                    <p className="text-lg font-bold text-slate-800">{room.capacite}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800">{room.nom}</h3>
                            <p className="text-sm text-slate-500 mb-1">{room.type}</p>
                            <p className="text-sm text-slate-400 mb-4">{room.batiment}</p>

                            <div className="mt-auto flex space-x-2 pt-4 border-t border-slate-50">
                                <button onClick={() => openEdit(room)} className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors">Edit</button>
                                <button onClick={() => openDelete(room)} className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Room">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                            placeholder="e.g. Amphi A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.capacite}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacite: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="">Select Type</option>
                            <option value="Amphitheater">Amphitheater</option>
                            <option value="Classroom">Classroom</option>
                            <option value="Laboratory">Laboratory</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.batiment}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, batiment: e.target.value })}
                            placeholder="e.g. Building C"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Room</button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Room">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nom}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nom: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.capacite}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacite: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="">Select Type</option>
                            <option value="Amphitheater">Amphitheater</option>
                            <option value="Classroom">Classroom</option>
                            <option value="Laboratory">Laboratory</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.batiment}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, batiment: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Room">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{selectedRoom?.nom}</span>?</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
