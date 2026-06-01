import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { dummyResumeData } from '../assets/assets';
import {
	ArrowLeftIcon,
	Briefcase,
	ChevronLeft,
	ChevronRight,
	FileText,
	FolderIcon,
	GraduationCap,
	Sparkles,
	User,
	Lock,
	Unlock,
	Share2,
	Download,
} 

from 'lucide-react';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import ColorPicker from '../components/ColorPicker';
import ExperienceForm from '../components/ExperienceForm';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import api from '../configs/apiClient';
import toast from 'react-hot-toast';

// Helper: initial empty resume shape
const emptyResume = () => ({
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
const ResumeBuilder = () => {
	const { resumeId } = useParams();
	const { token } = useSelector((state) => state.auth || {});

	const [resumeData, setResumeData] = useState(() => {
		const existing = dummyResumeData.find((item) => item._id === resumeId);
		return existing ?? emptyResume();
	});

	useEffect(() => {
		const loadExistingResume = async () => {
			if (!resumeId) return;
			try {
				const { data } = await api.get(`/api/resumes/get/${resumeId}`, { headers: { Authorization: token } });
				if (data?.resume) {
					setResumeData(data.resume);
					document.title = data.resume.title;
				}
			} catch (error) {
				console.log(error?.message || error);
			}
		};
		loadExistingResume();
	}, [resumeId, token]);
	const [activeSectionIndex, setActiveSectionIndex] = useState(0);
	const [removeBackground, setRemoveBackground] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	const section = [
		{ id: 'personal', name: 'Personal Info', icon: User },
		{ id: 'summary', name: 'Summary', icon: FileText },
		{ id: 'experience', name: 'Experience', icon: Briefcase },
		{ id: 'education', name: 'Education', icon: GraduationCap },
		{ id: 'projects', name: 'Projects', icon: FolderIcon },
		{ id: 'skills', name: 'Skills', icon: Sparkles },
	];

	const activeSection = section[activeSectionIndex];
	const ActiveIcon = activeSection.icon;

	useEffect(() => {
		const resume = dummyResumeData.find((item) => item._id === resumeId);
		document.title = resume?.title ?? 'Resume Builder';
	}, [resumeId]);

	const changeResumeVisibility = async () => {
		try {
			const fromData = new FormData();
			fromData.append("resumeId", resumeId)
			fromData.append("resumeData", JSON.stringify({public: !resumeData.public}))

			const {data} = await api.put(`/api/resumes/update`, fromData, {headers: {Authorization}})

			setResumeData({...resumeData, public: !resumeData.public})
			toast.success(data.message)
		} catch (error) {
			console.error("Error saving resume:", error)
		}
	}

	const downloadResumePDF = async () => {
		try {
			const element = document.getElementById('resume-preview');
			if (!element) {
				alert('Resume preview not found!');
				return;
			}

			// Clone the preview and render it offscreen to avoid modal/overlay interference
			const clone = element.cloneNode(true);
			const wrapper = document.createElement('div');
			wrapper.style.position = 'fixed';
			wrapper.style.left = '-9999px';
			wrapper.style.top = '0';
			wrapper.style.width = element.offsetWidth + 'px';
			wrapper.style.height = element.offsetHeight + 'px';
			wrapper.appendChild(clone);
			document.body.appendChild(wrapper);

			await document.fonts?.ready;

			const canvas = await html2canvas(clone, {
				scale: 2,
				useCORS: true,
				backgroundColor: '#ffffff',
			});

			// cleanup cloned node
			wrapper.remove();

			const imgData = canvas.toDataURL('image/jpeg', 0.95);
			const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

			const margin = 10; // mm
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pdfWidth - margin * 2;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			let heightLeft = imgHeight;
			let position = 0;

			pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
			heightLeft -= (pdfHeight - margin * 2);

			while (heightLeft > 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'JPEG', margin, position + margin, imgWidth, imgHeight);
				heightLeft -= (pdfHeight - margin * 2);
			}

			const fileName = (resumeData.personal_info?.full_name || 'resume').replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
			pdf.save(`${fileName}-resume.pdf`);
		} catch (error) {
			console.error('Error downloading resume:', error);
			alert('Error downloading resume. Please try again.');
		}
	};

	const printResume = () => {
		const element = document.getElementById('resume-preview');
		if (!element) {
			alert('Resume preview not found!');
			return;
		}

		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			alert('Unable to open print preview. Please allow popups for this site.');
			return;
		}

		const fileTitle = (resumeData.personal_info?.full_name || 'resume').replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();

		const html = `
			<!doctype html>
			<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>${fileTitle}</title>
				<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
				<style>body{margin:0;padding:24px;background:#f3f4f6} .resume-wrap{max-width:960px;margin:0 auto;background:#fff}</style>
			</head>
			<body>
				<div class="resume-wrap">${element.innerHTML}</div>
				<script>
					window.onload = function() { window.focus(); window.print(); };
				</script>
			</body>
			</html>
		`;

		printWindow.document.open();
		printWindow.document.write(html);
		printWindow.document.close();
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				<Link to='/app' className='inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-all font-medium'>
					<ArrowLeftIcon className='cursor-pointer' size={20} /> back to dashboard
				</Link>
			</div>

			<div className='max-w-7xl mx-auto px-4 pb-8'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					<div className='relative lg:col-span-5 rounded-xl overflow-hidden'>
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6 pt-8 backdrop-blur-sm' style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}>
							<hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
							<hr
								className='absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border-none transition-all duration-500'
								style={{ width: `${(activeSectionIndex * 100) / (section.length - 1)}%` }}
							/>

							<div className='flex items-center justify-between gap-2'>
								<div className='flex items-center gap-2 text-sm text-gray-800 font-semibold'>
									<div className='p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg'>
										<ActiveIcon className='w-5 h-5 text-indigo-600' />
									</div>
									<span className='text-base font-semibold'>{activeSection.name}</span>
								</div>
								<div className='flex items-center gap-2'>
									<TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData((prev) => ({ ...prev, template }))} />
									<ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))} />
								</div>
							</div>

							<div className='flex justify-end items-center gap-2 mb-6 border-b border-gray-200 py-3'>
								{activeSectionIndex !== 0 && (
									<button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all' disabled={activeSectionIndex === 0}>
										<ChevronLeft className='w-4 h-4' /> previous
									</button>
								)}
								<button
									onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, section.length - 1))}
									className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSectionIndex === section.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-600' : 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}`}
									disabled={activeSectionIndex === section.length - 1}
								>
									Next <ChevronRight className='w-4 h-4' />
								</button>
							</div>

							<div className='space-y-6'>
								{activeSection.id === 'personal' && (
									<PersonalInfoForm
										data={resumeData.personal_info}
										onchange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
										removeBackground={removeBackground}
										setRemoveBackground={setRemoveBackground}
									/>
								)}

								{activeSection.id === 'summary' && (
									<ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))} token={token} />
								)}

								{activeSection.id === 'experience' && (
									<ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))} token={token} />
								)}

								{activeSection.id === 'education' && (
									<EducationForm data={resumeData.education} onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))} />
								)}

								{activeSection.id === 'projects' && (
									<ProjectForm data={resumeData.project} onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))} />
								)}

								{activeSection.id === 'skills' && (
									<SkillsForm data={resumeData.skills} onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))} />
								)}

								{!['personal', 'summary', 'experience', 'education', 'projects', 'skills'].includes(activeSection.id) && (
									<p className='text-sm text-gray-500'>Section editor for {activeSection.name} will appear here.</p>
								)}
							</div>

							<div className='mt-8 pt-6 border-t border-gray-200'>
								<button
									onClick={() => {
									console.log('Resume Submitted:', resumeData);
									alert('Resume saved successfully!');
								}}
									className='w-full px-4 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:via-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl'
								>
									Save & Submit Resume
								</button>
							</div>
						</div>
					</div>

					<div className='lg:col-span-7 max-lg:mt-6'>
						<div className='lg:sticky lg:top-6'>
							<div className='rounded-xl border border-gray-100 bg-white shadow-lg backdrop-blur-sm p-4 sm:p-5' style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}>
								<div className='flex items-center justify-between mb-4'>
									<p className='text-sm font-semibold text-gray-800'>Live Resume Preview</p>
									<div className='flex items-center gap-2'>
										<button onClick={printResume} className='p-2.5 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-200 hover:scale-110 transition-all' title='Print resume'>
											<Download className='w-5 h-5' />
										</button>
										<button onClick={() => setResumeData((prev) => ({ ...prev, public: !prev.public }))} className={`p-2.5 rounded-lg transition-all hover:scale-110 ${resumeData.public ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={resumeData.public ? 'Public Resume' : 'Private Resume'}>
											{resumeData.public ? <Unlock className='w-5 h-5' /> : <Lock className='w-5 h-5' />}
										</button>
										<button onClick={() => setShowShareModal(true)} className='p-2.5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:scale-110 transition-all' title='Share Resume'>
											<Share2 className='w-5 h-5' />
										</button>
									</div>
								</div>
								<ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='rounded-lg overflow-hidden shadow-sm' />
							</div>
						</div>
					</div>
				</div>
			</div>

			{showShareModal && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Share Resume</h2>
							<button onClick={() => setShowShareModal(false)} className='text-gray-400 hover:text-gray-600 text-2xl font-light'>✕</button>
						</div>

						{resumeData.public ? (
							<div className='space-y-5'>
								<p className='text-sm text-gray-700'>Your resume is currently <span className='font-semibold text-green-600'>public</span>. Anyone with the link can view it.</p>
								<div className='bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg flex items-center justify-between border border-gray-200'>
									<input type='text' value={`${window.location.origin}/view/${resumeData._id}`} readOnly className='bg-transparent text-sm flex-1 outline-none font-mono' />
									<button onClick={() => {
										navigator.clipboard.writeText(`${window.location.origin}/view/${resumeData._id}`);
										alert('Link copied to clipboard!');
									}} className='text-blue-600 hover:text-blue-700 font-semibold text-sm ml-3'>
										Copy
									</button>
								</div>
								<button onClick={() => {
									setResumeData((prev) => ({ ...prev, public: false }));
									setShowShareModal(false);
								}} className='w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold'>
									Make Private
								</button>
							</div>
						) : (
							<div className='space-y-5'>
								<p className='text-sm text-gray-700'>Your resume is currently <span className='font-semibold text-gray-600'>private</span>. Make it public to share with others.</p>
								<button onClick={() => {
									setResumeData((prev) => ({ ...prev, public: true }));
									alert('Resume is now public! You can share the link.');
								}} className='w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold'>
									Make Public & Get Link
								</button>
							</div>
						)}

						<button onClick={() => setShowShareModal(false)} className='w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium'>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ResumeBuilder;