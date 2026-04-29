import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

const EducationForm = ({ data = [], onChange = () => {} }) => {
  const addEducation = () => {
    const newEdu = {
      degree: '',
      field: '',
      institution: '',
      graduation_date: '',
      gpa: '',
    };
    onChange([...data, newEdu]);
  };

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <p className="text-sm text-gray-500">Add your education history</p>
      </div>

      <button onClick={addEducation} className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
        <Plus className="w-4 h-4" /> Add Education
      </button>

      <div className="space-y-4 mt-4">
        {data.map((edu, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{edu.degree || `Entry #${index + 1}`}</h4>
              <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <input value={edu.degree || ''} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Degree (e.g., B.Sc)" required className="px-3 py-2 text-sm rounded-lg border" />
              <input value={edu.field || ''} onChange={(e) => updateEducation(index, 'field', e.target.value)} placeholder="Field of study" className="px-3 py-2 text-sm rounded-lg border" />

              <input value={edu.institution || ''} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="School/University name" className="px-3 py-2 text-sm rounded-lg border" />
              <input value={edu.graduation_date || ''} onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)} placeholder="Graduation date (YYYY-MM)" className="px-3 py-2 text-sm rounded-lg border" />

              <input value={edu.gpa || ''} onChange={(e) => updateEducation(index, 'gpa', e.target.value)} placeholder="GPA (optional)" className="px-3 py-2 text-sm rounded-lg border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;
