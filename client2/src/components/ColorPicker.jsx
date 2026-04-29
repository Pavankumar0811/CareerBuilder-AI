import { Check, Palette } from 'lucide-react';
import React, { useState } from 'react';

const ColorPicker = ({selectedColor, onChange }) => {
    const colors = [
        { name: 'Black', value: '#111827' },
        { name: 'Slate', value: '#334155' },
        { name: 'Gray', value: '#6B7280' },
        { name: 'Stone', value: '#78716C' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#fb923c' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Yellow', value: '#facc15' },
        { name: 'Lime', value: '#84cc16' },
        { name: 'Green', value: '#10b981' },
        { name: 'Emerald', value: '#059669' },
        { name: 'Teal', value: '#14b8a6' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Sky', value: '#38bdf8' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Violet', value: '#8b5cf6' },
        { name: 'Purple', value: '#a78bfa' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Rose', value: '#fb7185' },
    ];
      const [isOpen, setIsOpen] = useState(false);
        return (
                <div className='relative'>
                    <button onClick={()=> setIsOpen((prev) => !prev)} className='flex items-center gap-2 text-sm text-gray-700 bg-white ring-gray-200 hover:ring transition-all px-3 py-2 rounded-lg border border-gray-100'>
                        <div className='w-4 h-4 rounded-full border' style={{ backgroundColor: selectedColor }} />
                        <Palette size={16} className='text-gray-500' />
                        <span className='max-sm:hidden'>accent color</span>
                    </button>
                {isOpen && (
                    <div className='grid grid-cols-4 sm:grid-cols-6 w-72 gap-3 absolute top-full left-0 transform -translate-x-4 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                        {colors.map((color) => (
                            <div key={color.value} className='cursor-pointer group flex flex-col items-center p-1' onClick={()=> {onChange(color.value)}}>
                                <div className='w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors relative flex items-center justify-center' style={{ backgroundColor: color.value }}>
                                    {selectedColor === color.value && (
                                        <Check className='w-4 h-4 text-white drop-shadow' />
                                    )}
                                </div>
                                <p className='text-[11px] text-center mt-2 text-gray-600'>{color.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
}

export default ColorPicker;