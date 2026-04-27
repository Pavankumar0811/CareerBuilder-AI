import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkles, User } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';

const ResumeBuilder = () => {
	const { resumeId } = useParams();
	const [resumeData, setResumeData] = useState({
		_id: '',
		title: '',
		personal_info: {},
		professional_summary: '',
		experience: [],
		education: [],
		skills: [],
		project: [],
		template: 'Classic',
		accent_color: '#000000',
		public: false,
	});

	const loadExistingResume = () => {
		const resume = dummyResumeData.find((item) => item._id === resumeId);
		if (resume) {
			setResumeData(resume);
			document.title = resume.title;
		}
	};

	const [activeSectionIndex, setActiveSectionIndex] = useState(0);
	const [removeBackground, setRemoveBackground] = useState(false);

	const section = [
		{ id: 'personal', name: 'Personal Info', icon: User },
		{ id: 'summary', name: 'Summary', icon: FileText },
		{ id: 'experience', name: 'Experience', icon: Briefcase },
		{ id: 'education', name: 'Education', icon: GraduationCap },
		{ id: 'projects', name: 'Projects', icon: FolderIcon },
		{ id: 'skills', name: 'Skills', icon: Sparkles },
	];

	const activeSection = section[activeSectionIndex];

	useEffect(() => {
		loadExistingResume();
	}, [resumeId]);

	return (
		<div>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				<Link to='/app' className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
					<ArrowLeftIcon className='cursor-pointer' size={20} /> back to dashboard
				</Link>
			</div>
			<div className='max-w-7xl mx-auto px-4 pb-8'>
				<div className='grid lg:grid-cols-12 gap-8'>
					{/* left panel - form */}
					<div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
					{/* progress bar using activeSectionIndex */}
							<hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
							<hr
								className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-500'
								style={{ width: `${(activeSectionIndex * 100) / (section.length - 1)}%` }}
							/>

							{/* section navigation */}
							<div className='flex justify-between items-center mb-6 border-b border-gray-300 py-3'>
								<div className='flex items-center gap-2 text-sm text-gray-700 font-medium'>
									<activeSection.icon className='size-4' />
									{activeSection.name}
								</div>
								<div className='flex items-center'>
						{activeSectionIndex !== 0 && (
							<button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
								<ChevronLeft className='size-4' /> previous
							</button>
						)}
								<button
									onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, section.length - 1))}
									className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === section.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
									disabled={activeSectionIndex === section.length - 1}
								>
									Next <ChevronRight className='size-4' />
								</button>
								</div>
							</div>

							{/* form content */}
							<div className='space-y-6'>
								{activeSection.id === 'personal' && (
									<PersonalInfoForm
										data={resumeData.personal_info}
										onchange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
										removeBackground={removeBackground}
										setRemoveBackground={setRemoveBackground}
									/>
								)}
								{activeSection.id !== 'personal' && (
									<p className='text-sm text-gray-500'>Section editor for {activeSection.name} will appear here.</p>
								)}
							</div>
						</div>
					</div>
				{/*right side - resume form */}
					<div className='lg:col-span-7 rounded-lg border border-gray-200 bg-white p-6'>
						<h2 className='text-lg font-semibold text-gray-800'>Resume Preview</h2>
						<p className='mt-2 text-sm text-gray-500'>Preview pane will be rendered here.</p>
					</div>
				</div>

			</div>
		</div>
	);
};

export default ResumeBuilder;

