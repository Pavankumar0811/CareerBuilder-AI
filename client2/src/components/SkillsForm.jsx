import { Plus, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';

const SkillsForm = ({ data = [], onChange = () => {} }) => {
    const [newSkill, setNewSkill] = useState("");

    const addSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !data.includes(trimmed)) {
            onChange([...data, trimmed]);
            setNewSkill("");
        }
    };

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Skills</h3>
                <p className="text-sm text-gray-500">Add your technical and soft skills</p>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter a skill (e.g., Java, Python)"
                    className="flex-1 px-3 py-2 text-sm border rounded"
                    onChange={(e) => setNewSkill(e.target.value)}
                    value={newSkill}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {data.map((skill, index) => (
                        <span key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-800 text-white rounded-full text-sm">
                            {skill}
                            <button onClick={() => removeSkill(index)} className="ml-2 hover:bg-blue-700 rounded-full p-0.5 transition-colors">
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-gray-500">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No Skills Added Yet</p>
                    <p className="text-sm">Add your technical and soft skills above.</p>
                </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800"><strong>Tip:</strong> Add relevant skills. Include technical skills (programming languages, tools).</p>
            </div>
        </div>
    );
};

export default SkillsForm;