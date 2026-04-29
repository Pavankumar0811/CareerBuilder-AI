import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

const ProjectForm = ({ data = [], onChange = () => {} }) => {
  const addProject = () => {
    const newProject = { name: '', type: '', description: '' };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => onChange(data.filter((_, i) => i !== index));

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <div className='grid gap-3'>
        <div>
          <h3 className='text-lg font-medium text-gray-900'>Project</h3>
          <p className='text-sm text-gray-500'>Add your projects </p>
        </div>
        <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors'>
          <Plus className='w-5 h-5 text-yellow-400' /> Add Project
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {data.map((project, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            <div className='flex justify-between items-start'>
              <h4>Project #{index + 1}</h4>
              <button onClick={() => removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                <Trash2 className='w-4 h-4' />
              </button>
            </div>

            <div className='grid md:grid-cols-2 gap-3'>
              <input value={project.name || ''} onChange={(e) => updateProject(index, 'name', e.target.value)} type='text' placeholder='project name' className='px-3 py-2 text-sm rounded-lg ' />
              <input value={project.type || ''} onChange={(e) => updateProject(index, 'type', e.target.value)} type='text' placeholder='project type' className='px-3 py-2 text-sm rounded-lg ' />
              <textarea rows={4} value={project.description || ''} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder='Describe your project...' className='w-full px-3 py-2 text-sm rounded-lg resize-none ' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
