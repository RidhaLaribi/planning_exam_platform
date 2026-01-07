'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import {
    BarChart,
    Activity,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Users
} from 'lucide-react';

interface Conflict {
    id: number;
    type: string;
    severity: string; // 'low' | 'medium' | 'high' | 'critical'
    description: string;
}

interface Stat {
    total_exams: number;
    total_conflicts: number;
}

export default function ChefDepartmentDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stat | null>(null);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [validationStatus, setValidationStatus] = useState('draft');
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/chef-departement/dashboard');
            setStats(response.data.stats);
            setConflicts(response.data.conflicts);
            setValidationStatus(response.data.validation_status);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // alert('Failed to load department data. Please ensure you are logged in as a Department Head.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidate = async () => {
        if (!confirm('Validate department schedule? This signals readiness to the Doyen.')) return;

        setIsValidating(true);
        try {
            await api.post('/chef-departement/validate', { comments: 'Validated by Chef Dept' });
            fetchDashboardData();
            alert('Department schedule validated!');
        } catch (error) {
            console.error('Validation failed:', error);
            alert('Validation failed.');
        } finally {
            setIsValidating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Department Dashboard</h1>
                    <p className="text-slate-500">Department-level schedule management</p>
                </div>
                <div>
                    {validationStatus !== 'validated_chef' && validationStatus !== 'validated_doyen' ? (
                        <button
                            onClick={handleValidate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                            disabled={isValidating}
                        >
                            <CheckCircle size={20} />
                            {isValidating ? 'Validating...' : 'Validate Department Schedule'}
                        </button>
                    ) : (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-green-200">
                            <CheckCircle size={20} />
                            Validated ({validationStatus.replace('validated_', '')})
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Department Exams</h3>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats?.total_exams || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Active Conflicts</h3>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats?.total_conflicts || 0}</p>
                </div>
            </div>

            {/* Conflicts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Conflict Report</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Severity</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conflicts.length > 0 ? conflicts.map((conflict) => (
                                <tr key={conflict.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {conflict.type.replace('_', ' ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${conflict.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                                conflict.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-yellow-100 text-yellow-800'}
                                `}>
                                            {conflict.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {conflict.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Resolve</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        No conflicts found directly in this department.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
