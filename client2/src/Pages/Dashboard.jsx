import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';
import { dummyResumeData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {

    const colors = ["#4F46E5", "#DB2777", "#16A34A", "#D97706", "#2563EB", "#9333EA", "#DC2626", "#059669"];

  const[allResumes, setAllResumes] = useState(() => dummyResumeData);
   const[showCreateResume, setShowCreateResume] = useState(false);
   const[showUploadResume, setShowUploadResume] = useState(false);
   const[title, setTitle] = useState('');
   const[resume, setResume] = useState(null);
   const[editresumeid, setEditResumeId] = useState('');
  const[deleteResumeId, setDeleteResumeId] = useState('');

   const navigate = useNavigate();

    const createResume = async (event) => {
        event.preventDefault();
        setShowCreateResume(false)
        navigate('/app/builder/resume123', {state: {title: title, resume: null}})
    }

    const uploadResume = async (event) => {
      event.preventDefault();
      setShowUploadResume(false);
      navigate('/app/builder/resume123', {state: {title: title, resume: resume}})
    }

    const editTitle = async (event) => {
      event.preventDefault();
      setAllResumes((prevResumes) =>
        prevResumes.map((resumeItem) =>
          resumeItem._id === editresumeid
            ? { ...resumeItem, title: title, updatedAt: new Date().toISOString() }
            : resumeItem
        )
      );
      setEditResumeId('');
      setTitle('');
    }

    const deleteResume = async () => {
      setAllResumes((prevResumes) => prevResumes.filter((resumeItem) => resumeItem._id !== deleteResumeId));
      setDeleteResumeId('');
    }

    return (
        <div>
            <h1 className='flex items-center justify-center text-2xl font-bold text-blue-700'>lets get started !</h1>
            <div className='flex center items-center justify-center gap-6 mt-10 flex-wrap'>
            <button onClick={()=> setShowCreateResume(true)} className='w-full bg-white sm:max-w-70 h-60 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-cyan-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
                <div className='relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 group-hover:from-cyan-500 group-hover:via-indigo-500 group-hover:to-purple-600 transition-all duration-300'>
                  <PlusIcon className='size-8 text-white drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300'/>
                  <span className='absolute inset-0 rounded-full opacity-0 group-hover:opacity-70 bg-white/40 animate-ping'></span>
                </div>
                <p className='text-sm group-hover:text-cyan-600 transition-all duration-300'>create new resume</p>
            </button>
             <button onClick={()=> setShowUploadResume(true)} className='w-full bg-white sm:max-w-70 h-60 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-cyan-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
                <div className='relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-indigo-500 group-hover:from-cyan-500 group-hover:via-purple-500 group-hover:to-indigo-600 transition-all duration-300'>
                  <UploadCloudIcon className='size-8 text-white drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300'/>
                  <span className='absolute inset-0 rounded-full opacity-0 group-hover:opacity-70 bg-white/40 animate-ping'></span>
                </div>
                <p className='text-sm group-hover:text-cyan-600 transition-all duration-300'>upload resume</p>
            </button>
            </div>
            <hr className='my-10 border-blue-800 '/>
            <div className='grid grid-cols-2 sm:flex flex-wrap gap-4 flex items-center justify-center'>
                {allResumes.map((resume, index) => {
                const basecolor = colors[index % colors.length];
                return (
                  <button
                    key={index}
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${basecolor}10, ${basecolor}40)`,
                      borderColor: basecolor + "40",
                    }}
                  >
                    <FilePenLineIcon
                      className="size-7 group-hover:scale-105 transition-all"
                      style={{ color: basecolor }}
                    />
                    <p
                      className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                      style={{ color: basecolor }}
                    >
                      {resume.title}
                    </p>
                    <p
                      className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                      style={{ color: basecolor + '90' }}
                    >
                      updated on {new Date(resume.updatedAt || resume.updated_at).toLocaleDateString()}
                    </p>
                    <div onClick={e=>e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex items-center hidden">
                      <TrashIcon onClick={()=> setDeleteResumeId(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                      <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                    </div>
                  </button>
                );
              })}
              {showCreateResume && (
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => {
                    setShowCreateResume(false);
                    setTitle('');
                  }}
                >
                  <form
                    onSubmit={createResume}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-gradient-to-br from-white/95 via-indigo-50 to-white/90 rounded-lg w-full max-w-sm p-6 transform transition-all duration-300 animate-modal-in glow-ring overflow-hidden"
                    style={{ boxShadow: '0 14px 40px rgba(99,102,241,0.18), 0 4px 12px rgba(16,24,40,0.06)' }}
                  >
                    <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-300/40 to-purple-300/30 blur-3xl pointer-events-none" />
                    <XIcon
                      className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-10"
                      onClick={() => {
                        setShowCreateResume(false);
                        setTitle('');
                      }}
                    />
                    <h2 className="text-2xl font-extrabold mb-3 text-slate-800 z-10">Create resume</h2>
                    <p className="text-sm text-slate-500 mb-4 z-10">Give your resume a title to get started.</p>
                    <input
                      type="text"
                      placeholder="Enter resume title"
                      className="w-full px-4 py-3 mb-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                    />
                    <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg btn-glow z-10 shadow-[0_8px_24px_rgba(99,102,241,0.22)] hover:scale-105 transition-transform">
                      Create resume
                    </button>
                  </form>
                </div>
              )}
             
              {showUploadResume && (

                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => {
                    setShowUploadResume(false);
                    setTitle('');
                  }}
                >
                  <form
                    onSubmit={uploadResume}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-gradient-to-br from-white/95 via-indigo-50 to-white/90 rounded-lg w-full max-w-sm p-6 transform transition-all duration-300 animate-modal-in glow-ring overflow-hidden"
                    style={{ boxShadow: '0 14px 40px rgba(99,102,241,0.18), 0 4px 12px rgba(16,24,40,0.06)' }}
                  >
                    <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-300/40 to-purple-300/30 blur-3xl pointer-events-none" />
                    <XIcon
                      className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-10"
                      onClick={() => {
                        setShowUploadResume(false);
                        setTitle('');
                      }}
                    />
                    <h2 className="text-2xl font-extrabold mb-3 text-slate-800 z-10">upload resume</h2>
                    <p className="text-sm text-slate-500 mb-4 z-10">Give your resume a title to get started.</p>
                    <input
                    
                      type="text"
                      placeholder="Enter resume title"
                      className="w-full px-4 py-3 mb-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                    />
                    <div>
                       <label htmlFor="resume input" className="block text-sm font-medium text-slate-700 mb-2 z-10">select resume file
                        <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 cursor-pointer transition-colors'>
                          {resume ? (
                            <p className='text-sm text-slate-600'>{resume.name}</p>
                          ) : (
                            <>
                            <UploadCloud className='size-14 stroke-1' />
                            <p>upload resume</p>
                            </>
                          )}
                        </div>
                       </label>
                       <input type='file' id='resume input' accept='.pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg btn-glow z-10 shadow-[0_8px_24px_rgba(99,102,241,0.22)] hover:scale-105 transition-transform">
                      upload resume
                    </button>
                  </form>
                </div>
               )}
              
               {editresumeid &&(
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => {
                    setEditResumeId('');
                    setTitle('');
                  }}
                >
                  <form
                    onSubmit={editTitle}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-gradient-to-br from-white/95 via-indigo-50 to-white/90 rounded-lg w-full max-w-sm p-6 transform transition-all duration-300 animate-modal-in glow-ring overflow-hidden"
                    style={{ boxShadow: '0 14px 40px rgba(99,102,241,0.18), 0 4px 12px rgba(16,24,40,0.06)' }}
                  >
                    <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-300/40 to-purple-300/30 blur-3xl pointer-events-none" />
                    <XIcon
                      className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-10"
                      onClick={() => {
                        setEditResumeId('');
                        setTitle('');
                      }}
                    />
                    <h2 className="text-2xl font-extrabold mb-3 text-slate-800 z-10">edit resume title</h2>
                    <p className="text-sm text-slate-500 mb-4 z-10">Give your resume a title to get started.</p>
                    <input
                      type="text"
                      placeholder="Enter resume title"
                      className="w-full px-4 py-3 mb-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                    />
                    <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg btn-glow z-10 shadow-[0_8px_24px_rgba(99,102,241,0.22)] hover:scale-105 transition-transform">
                      update title
                    </button>
                  </form>
                </div>
              )}

              {deleteResumeId && (
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setDeleteResumeId('')}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-gradient-to-br from-white/95 via-red-50 to-white/90 rounded-lg w-full max-w-sm p-6 transform transition-all duration-300 animate-modal-in glow-ring overflow-hidden"
                    style={{ boxShadow: '0 14px 40px rgba(239,68,68,0.18), 0 4px 12px rgba(16,24,40,0.06)' }}
                  >
                    <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-red-300/40 to-orange-300/30 blur-3xl pointer-events-none" />
                    <XIcon
                      className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer z-10"
                      onClick={() => setDeleteResumeId('')}
                    />
                    <h2 className="text-2xl font-extrabold mb-3 text-slate-800 z-10">Delete resume?</h2>
                    <p className="text-sm text-slate-500 mb-6 z-10">
                      This will permanently remove the resume from your dashboard.
                    </p>
                    <div className="flex gap-3 z-10">
                      <button
                        type="button"
                        onClick={() => setDeleteResumeId('')}
                        className="w-full py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={deleteResume}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-105 transition-transform shadow-[0_8px_24px_rgba(239,68,68,0.22)]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
             

            </div>
        </div>
    );
};

export default Dashboard;
