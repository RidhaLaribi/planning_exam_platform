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
    Users,
    Building
} from 'lucide-react';

interface KPI {
    total_exams: number;
    occupancy_rate: number;
    total_unscheduled: number;
}

interface UnscheduledStat {
    nom: string;
    count: number;
}

export default function DoyenDashboard() {
    const router = useRouter();
    const [kpis, setKpis] = useState<KPI | null>(null);
    const [unscheduledByDept, setUnscheduledByDept] = useState<UnscheduledStat[]>([]);
    const [validationStatus, setValidationStatus] = useState('draft');
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/doyen/dashboard');
            setKpis(response.data.kpis);
            setUnscheduledByDept(response.data.unscheduled_by_dept);
            setValidationStatus(response.data.validation_status);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // fallback mock for demo if backend not ready? No, strict backend usage.
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidate = async () => {
        if (!confirm('Are you sure you want to validate the final schedule? This action cannot be undone easily.')) return;

        setIsValidating(true);
        try {
            await api.post('/doyen/validate', { comments: 'Validated via Dashboard' });
            fetchDashboardData();
            alert('Schedule successfully validated!');
        } catch (error) {
            console.error('Validation failed:', error);
            alert('Validation failed.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleDetectConflicts = async () => {
        setIsLoading(true);
        try {
            await api.post('/doyen/detect-conflicts');
            fetchDashboardData();
            alert('Conflict detection complete.');
        } catch (error) {
            alert('Conflict detection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Doyen Dashboard</h1>
                    <p className="text-slate-500">Global supervision and validation</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-red-600 font-medium mr-4">Logout</button>
                    {/* <button
                        onClick={handleDetectConflicts}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        disabled={isValidating}
                    >
                        <Activity size={20} />
                        Run Conflict Check
                    </button> */}

                    {validationStatus !== 'validated_doyen' ? (
                        <button
                            onClick={handleValidate}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                            disabled={isValidating}
                        >
                            <CheckCircle size={20} />
                            {isValidating ? 'Validating...' : 'Validate Final Schedule'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-green-200">
                                <CheckCircle size={20} />
                                Schedule Validated
                            </div>
                            <button
                                onClick={async () => {
                                    if (!confirm('Cancel validation? You will need to validate again.')) return;
                                    try {
                                        await api.post('/doyen/invalidate');
                                        fetchDashboardData();
                                    } catch (e) { alert('Failed to cancel validation'); }
                                }}
                                className="text-red-500 hover:text-red-700 text-sm font-medium underline"
                            >
                                Cancel Validation
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Total Exams</h3>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{kpis?.total_exams || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Occupancy Rate</h3>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Building size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{kpis?.occupancy_rate || 0}%</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(kpis?.occupancy_rate || 0, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Unscheduled Exams</h3>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{kpis?.total_unscheduled || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-medium">Avg Exams/Prof</h3>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">4.2</p> {/* Mocked for now, simplified */}
                    <span className="text-xs text-slate-400">Target: &lt; 5</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Unscheduled by Department */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Unscheduled Exams by Department</h2>
                    <div className="space-y-4">
                        {unscheduledByDept.length > 0 ? unscheduledByDept.map((dept, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">{dept.nom}</span>
                                    <span className="text-slate-500">{dept.count} unscheduled</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((dept.count / 10) * 100, 100)}%` }} // Scaling
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-400 text-center py-8">No unscheduled exams.</p>
                        )}
                    </div>
                </div>

                {/* Global Schedule Placeholder / Mini View */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Schedule Overview</h2>
                    <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-400">Global Exam Timetable Visualization</p>
                        {/* Complex Calendar would go here */}
                    </div>
                </div>
                <button className="w-full mt-4 py-2 text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors text-sm">
                    View Full Schedule &rarr;
                </button>
            </div>
        </div>

    );
}
