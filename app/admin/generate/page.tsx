'use client';

import { useState } from 'react';

export default function GenerateSchedulePage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setSuccess(false);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        setIsGenerating(false);
        setSuccess(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Generate Exam Schedule</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto text-center">
                <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to Generate Schedule?</h2>
                    <p className="text-slate-500">
                        This algorithm will approximate the best possible schedule considering room capacity, professor availability, and student formations.
                    </p>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Schedule generated successfully!
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'run Genetic Algorithm'
                    )}
                </button>
            </div>

            <div className="max-w-2xl mx-auto mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Configuration</h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600">Semester</span>
                        <span className="font-medium text-slate-800">Spring 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600">Exam Period</span>
                        <span className="font-medium text-slate-800">May 15 - May 30</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600">Included Departments</span>
                        <span className="font-medium text-slate-800">All</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
