import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon, UploadCloud, LoaderCircleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { dummyResumeData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import api from '../configs/apiClient';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const colors = ["#4F46E5", "#DB2777", "#16A34A", "#D97706", "#2563EB", "#9333EA", "#DC2626", "#059669"];

  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editresumeid, setEditResumeId] = useState('');
  const [deleteResumeId, setDeleteResumeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadUploadedResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } });
      setUploadedResumes(data?.resumes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadUploadedResumes();
    }
  }, [token]);

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } });
      setUploadedResumes((prev) => [...prev, data.resume]);
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) return toast.error('Please select a PDF file to upload');

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', resume);
      formData.append('title', title);

      const { data } = await api.post('/api/ai/upload-resume', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
      });

      setUploadedResumes((prev) => [...prev, data.resume]);
      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      if (data?.resume?._id) navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editresumeid, resumeData: { title } },
        { headers: { Authorization: token } }
      );
      setUploadedResumes((prev) => prev.map((item) => (item._id === editresumeid ? { ...item, title } : item)));
      setTitle('');
      setEditResumeId('');
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
      if (confirmDelete) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } });
        setUploadedResumes((prev) => prev.filter((item) => item._id !== resumeId));
        toast.success(data.message);
        setDeleteResumeId('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Resume Dashboard</h1>
            <p className='text-sm text-slate-600 mt-1'>Sample resumes on the left, your saved MongoDB resumes on the right.</p>
          </div>
          <div className='text-sm text-slate-500'>Signed in as <span className='font-semibold text-slate-700'>{user?.name || 'User'}</span></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <section className='lg:col-span-5'>
            <div className='sticky top-6 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-lg p-6'>
              <h2 className='text-lg font-semibold text-slate-900 mb-2'>Sample Resumes</h2>
              <p className='text-sm text-slate-500 mb-5'>These are the built-in examples: Alex, Jordan, and Riley.</p>

              <div className='space-y-4'>
                {dummyResumeData.map((resumeItem, index) => {
                  const baseColor = colors[index % colors.length];
                  return (
                    <button
                      key={resumeItem._id}
                      onClick={() => navigate(`/app/builder/${resumeItem._id}`)}
                      className='w-full text-left rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5'
                      style={{ background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}22)`, borderColor: `${baseColor}40` }}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-semibold' style={{ color: baseColor }}>{resumeItem.title}</p>
                          <p className='text-sm text-slate-600'>{resumeItem.personal_info?.full_name}</p>
                        </div>
                        <span className='text-[11px] px-2 py-1 rounded-full bg-white/70 text-slate-600 uppercase tracking-wide'>{resumeItem.template}</span>
                      </div>
                      <p className='mt-2 text-xs text-slate-500 line-clamp-2'>{resumeItem.professional_summary}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className='lg:col-span-7'>
            <div className='rounded-2xl border border-slate-200 bg-white shadow-lg p-6'>
              <div className='flex items-center justify-between gap-3 flex-wrap mb-6'>
                <div>
                  <h2 className='text-lg font-semibold text-slate-900'>Your Saved Resumes</h2>
                  <p className='text-sm text-slate-500'>These are the resumes stored in MongoDB for your account.</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                  <button onClick={() => setShowCreateResume(true)} className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors'>
                    <PlusIcon className='size-4' /> Create new
                  </button>
                  <button disabled={isLoading} onClick={() => setShowUploadResume(true)} className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60'>
                    {isLoading ? <LoaderCircleIcon className='size-4 animate-spin' /> : <UploadCloudIcon className='size-4' />} Upload PDF
                  </button>
                </div>
              </div>

              {uploadedResumes.length === 0 ? (
                <div className='rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500'>
                  No saved resumes yet. Create one or upload a PDF to store it in MongoDB.
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {uploadedResumes.map((resumeItem, index) => {
                    const baseColor = colors[index % colors.length];
                    return (
                      <button
                        key={resumeItem._id}
                        onClick={() => navigate(`/app/builder/${resumeItem._id}`)}
                        className='relative text-left rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5'
                        style={{ background: `linear-gradient(135deg, ${baseColor}08, ${baseColor}20)`, borderColor: `${baseColor}40` }}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold' style={{ color: baseColor }}>{resumeItem.title}</p>
                            <p className='text-xs text-slate-500 mt-1'>{resumeItem.personal_info?.full_name || 'Untitled profile'}</p>
                          </div>
                          <div onClick={(e) => e.stopPropagation()} className='flex items-center gap-1'>
                            <TrashIcon onClick={() => setDeleteResumeId(resumeItem._id)} className='size-8 p-1.5 rounded-lg text-slate-700 hover:bg-white/80' />
                            <PencilIcon onClick={() => { setEditResumeId(resumeItem._id); setTitle(resumeItem.title); }} className='size-8 p-1.5 rounded-lg text-slate-700 hover:bg-white/80' />
                          </div>
                        </div>
                        <p className='mt-3 text-xs text-slate-500'>Updated {new Date(resumeItem.updatedAt || resumeItem.createdAt || Date.now()).toLocaleDateString()}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {showCreateResume && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => { setShowCreateResume(false); setTitle(''); }}>
          <form onSubmit={createResume} onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl'>
            <XIcon className='absolute top-4 right-4 text-slate-600 cursor-pointer' onClick={() => { setShowCreateResume(false); setTitle(''); }} />
            <h2 className='text-2xl font-bold mb-2'>Create resume</h2>
            <p className='text-sm text-slate-500 mb-4'>Give your resume a title to store it in MongoDB.</p>
            <input type='text' placeholder='Enter resume title' className='w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' required value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <button className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Create resume</button>
          </form>
        </div>
      )}

      {showUploadResume && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null); }}>
          <form onSubmit={uploadResume} onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl'>
            <XIcon className='absolute top-4 right-4 text-slate-600 cursor-pointer' onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null); }} />
            <h2 className='text-2xl font-bold mb-2'>Upload resume</h2>
            <p className='text-sm text-slate-500 mb-4'>Upload a PDF and we’ll store the extracted resume in MongoDB.</p>
            <input type='text' placeholder='Enter resume title' className='w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' required value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <label htmlFor='resume-file' className='block'>
              <div className='flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-6 mb-4 cursor-pointer text-slate-500'>
                {resume ? <p className='text-sm font-medium text-slate-700'>{resume.name}</p> : <><UploadCloud className='size-10' /><p>Select a PDF file</p></>}
              </div>
            </label>
            <input id='resume-file' type='file' accept='.pdf' hidden onChange={(e) => setResume(e.target.files?.[0] || null)} />
            <button className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60' disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload resume'}
            </button>
          </form>
        </div>
      )}

      {editresumeid && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => { setEditResumeId(''); setTitle(''); }}>
          <form onSubmit={editTitle} onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl'>
            <XIcon className='absolute top-4 right-4 text-slate-600 cursor-pointer' onClick={() => { setEditResumeId(''); setTitle(''); }} />
            <h2 className='text-2xl font-bold mb-2'>Edit resume title</h2>
            <p className='text-sm text-slate-500 mb-4'>Update the title for this saved resume.</p>
            <input type='text' placeholder='Enter resume title' className='w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' required value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <button className='w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Update title</button>
          </form>
        </div>
      )}

      {deleteResumeId && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => setDeleteResumeId('')}>
          <div onClick={(e) => e.stopPropagation()} className='relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl'>
            <XIcon className='absolute top-4 right-4 text-slate-600 cursor-pointer' onClick={() => setDeleteResumeId('')} />
            <h2 className='text-2xl font-bold mb-2'>Delete resume?</h2>
            <p className='text-sm text-slate-500 mb-6'>This will remove the resume from MongoDB.</p>
            <div className='flex gap-3'>
              <button type='button' onClick={() => setDeleteResumeId('')} className='w-full py-3 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors'>Cancel</button>
              <button type='button' onClick={() => deleteResume(deleteResumeId)} className='w-full py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors'>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
