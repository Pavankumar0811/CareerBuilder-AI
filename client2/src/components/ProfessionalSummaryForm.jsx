import { Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import api from '../configs/apiClient';
import toast from 'react-hot-toast';

const ProfessionalSummaryForm =({data, onChange, token}) => {
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        const currentSummary = (data || '').trim();

        if (!currentSummary) {
            toast.error('Add a summary first, then enhance it with AI.');
            return;
        }

        try {
            setIsEnhancing(true);
            const { data: response } = await api.post(
                '/api/ai/enhance-pro-sum',
                { userContent: currentSummary },
                { headers: { Authorization: token } }
            );

            onChange(response.enhancedContent || currentSummary);
            toast.success('Summary enhanced with AI');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsEnhancing(false);
        }
    };
   
        return (
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                 <div>
                    <h3 className='text-lg font-medium text-gray-900'>Professional Summary</h3>
                    <p className='text-sm text-gray-500'>Add summary for your resume here.</p>
                 </div>
                      <button
                          type='button'
                          onClick={handleEnhance}
                          disabled={isEnhancing}
                          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                          <Sparkles className='size-5 text-yellow-400' />
                          {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                 </button>
                </div>
                <div className='mt-6'>
                    <textarea value={data || ""} onChange={(e)=> onChange(e.target.value)} rows={7} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' placeholder='write a compelling professionla summary that higlights your key strengths and carrer objectives...'/>
                        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: keep it concise(3-4 sentences) and focus on your most relavent achivement and skills.</p>
                </div>
            </div>
        )
}

export default ProfessionalSummaryForm;