import React from 'react';
import { User } from 'lucide-react';

const PersonalInfoForm = ({ data = {}, onchange, removeBackground, setRemoveBackground }) => {
    const handleChange = (field, value) => {
        onchange({ ...data, [field]: value });
    };
    
     
    
    return (
        <div>
            <h3 className='text-base font-semibold text-gray-800'>Personal information</h3>
            <p className='text-sm text-gray-600'>Get started with your personal information.</p>

            <div className='flex items-center gap-2 mt-3'>
                <label>
                    {data.image ? (
                        <img
                            src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                            alt='user image'
                            className='w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80'
                        />
                    ) : (
                        <div className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-700 cursor-pointer'>
                            <User className='size-10 p-2.5 border rounded-full' />
                            Upload user image
                        </div>
                    )}

                    <input
                        type='file'
                        accept='image/jpeg, image/png'
                        className='hidden'
                        onChange={(e) => handleChange('image', e.target.files?.[0])}
                    />
                </label>

                {typeof data.image === 'object' && data.image && (
                    <div className='flex flex-col gap-1 pl-4 text-sm'>
                        <p>Remove background</p>
                        <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                            <input
                                type='checkbox'
                                className='sr-only peer'
                                checked={removeBackground}
                                onChange={() => setRemoveBackground((prev) => !prev)}
                            />
                            <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200' />
                            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4' />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalInfoForm;
