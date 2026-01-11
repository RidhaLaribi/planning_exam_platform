'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { Play, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function GenerateSchedulePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const pollStatus = async (jobId: string) => {
        try {
            const statusRes = await api.get(`/schedule/status/${jobId}`);
            const data = statusRes.data;

            if (data.status === 'completed') {
                setResult(data.result);
                setLoading(false);
            } else if (data.status === 'failed') {
                alert('Generation failed: ' + data.error);
                setLoading(false);
            } else {
                // Still processing, poll again in 2s
                setTimeout(() => pollStatus(jobId), 2000);
            }
        } catch (error) {
            console.error('Polling failed:', error);
            setTimeout(() => pollStatus(jobId), 2000);
        }
    };

    const handleGenerate = async () => {
        if (!confirm('This will overwrite existing exams. Continue?')) return;

        setLoading(true);
        setResult(null);

        try {
            // Start Job
            const response = await api.post('/schedule/generate');
            const jobId = response.data.jobId;

            // Start Polling
            pollStatus(jobId);

        } catch (error: any) {
            console.error('Generation failed:', error);
            alert('Start failed: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Automatic Schedule Generator</h1>
                <p className="text-slate-500">
                    High-performance algorithm to generate conflict-free exam timetables.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Status</h3>
                        <p className="text-sm text-slate-500">
                            {loading ? 'Processing queue...' : result ? 'Complete' : 'Ready to start'}
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <Play size={20} className="fill-current" />
                        )}
                        {loading ? 'Processing...' : 'Start Generation'}
                    </button>
                </div>

                {/* Results Metrics */}
                {result && (
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500`}>
                        <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
                            <span className="text-3xl font-bold text-green-700">{result.scheduled}</span>
                            <span className="text-sm text-green-600 font-medium">Exams Scheduled</span>
                            <span className="text-xs text-green-500 mt-1">out of {result.total} modules</span>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <Clock className="h-10 w-10 text-blue-600 mb-3" />
                            <span className="text-3xl font-bold text-blue-700">{result.time}</span>
                            <span className="text-sm text-blue-600 font-medium">Execution Time</span>
                        </div>

                        {result.scheduled < result.total && (
                            <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                                <AlertTriangle className="h-10 w-10 text-orange-600 mb-3" />
                                <span className="text-3xl font-bold text-orange-700">{result.total - result.scheduled}</span>
                                <span className="text-sm text-orange-600 font-medium">Unscheduled</span>
                                <span className="text-xs text-orange-500 mt-1">Constraint violations</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Helper Text */}
                <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-400">
                    <p className="font-medium text-slate-500 mb-2">Algorithm details:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Algorithm: Greedy Best-Fit with Degree+Size heuristics</li>
                        <li>Constraints Enforced: 1 exam/day/student, Room Capacity, Professor Availability</li>
                        <li>Optimization: In-memory conflict graph (O(1) lookups)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
