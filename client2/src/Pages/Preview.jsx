import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeftIcon } from 'lucide-react';

const Preview = () => {
    const { resumeId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = dummyResumeData.find(resume => resume._id === resumeId);
                setResumeData(resume || null);
            } catch (error) {
                console.error('Error loading resume:', error);
                setResumeData(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadResume();
    }, [resumeId]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <Link to='/' className='inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-all font-medium mb-6'>
                    <ArrowLeftIcon className='cursor-pointer' size={20} /> Back to Home
                </Link>

                {isLoading ? (
                    <div className='flex items-center justify-center h-screen'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
                            <p className='text-slate-600'>Loading resume...</p>
                        </div>
                    </div>
                ) : resumeData ? (
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>{resumeData.personal_info?.full_name || resumeData.title}</h1>
                        <p className='text-gray-500 mb-6'>{resumeData.title}</p>
                        <div className='border-t border-gray-200 pt-6'>
                            <ResumePreview 
                                data={resumeData} 
                                template={resumeData.template} 
                                accentColor={resumeData.accent_color} 
                                classes='rounded-lg overflow-hidden'
                            />
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='text-center'>
                            <p className='text-6xl text-slate-300 font-light mb-4'>😔</p>
                            <p className='text-3xl text-slate-500 font-semibold mb-2'>Resume Not Found</p>
                            <p className='text-slate-400 mb-8'>The resume you are looking for does not exist or has been deleted.</p>
                            <Link to='/' className='inline-flex gap-2 items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-medium'>
                                <ArrowLeftIcon className='size-5' />
                                Go to Home Page
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;