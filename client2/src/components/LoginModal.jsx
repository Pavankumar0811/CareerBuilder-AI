import React from 'react';
import api from '../configs/apiClient';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, initialMode = 'register' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState(initialMode);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', newPassword: '' });
  const [captchaValue, setCaptchaValue] = React.useState('');
  const [captchaInput, setCaptchaInput] = React.useState('');
  const [resetSuccess, setResetSuccess] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    if (mode === 'forgot') {
      setCaptchaValue(generateCaptcha());
      setCaptchaInput('');
      setResetSuccess(false);
      setCopied(false);
      setFormData(prev => ({ ...prev, newPassword: '' }));
    }
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formData.newPassword);
      setCopied(true);
      toast.success('Password copied to clipboard');
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const goToLogin = () => {
    setMode('login');
    setResetSuccess(false);
    setCaptchaInput('');
    setCopied(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'register'
        ? '/api/users/register'
        : mode === 'forgot'
          ? '/api/users/reset-password'
          : '/api/users/login';

      if (mode === 'forgot' && captchaInput.trim().toUpperCase() !== captchaValue) {
        toast.error('Captcha does not match');
        setLoading(false);
        return;
      }

      const payload = mode === 'register'
        ? { name: formData.name, email: formData.email, password: formData.password }
        : mode === 'forgot'
          ? { email: formData.email, password: formData.newPassword || formData.password }
          : { email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      if (mode === 'register') {
        toast.success(data.message || 'Account created successfully. Please log in.');
        setMode('login');
        setFormData({ name: '', email: formData.email, password: '' });
        return;
      }

      if (mode === 'forgot') {
        setResetSuccess(true);
        setFormData(prev => ({ ...prev, newPassword: prev.newPassword || prev.password }));
        toast.success(data.message || 'Password reset successfully');
        return;
      }

      dispatch(login({ token: data.token, user: data.user }));
      localStorage.setItem('token', data.token);
      toast.success(data.message || 'Logged in successfully');
      onClose();
      navigate('/app');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid password or email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {mode === 'register' ? 'Sign up' : mode === 'forgot' ? 'Forgot password' : 'Login'}
          </h3>
          <button onClick={onClose} aria-label="close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          {mode === 'register'
            ? 'Please register to continue'
            : mode === 'forgot'
              ? 'Verify the captcha to set a new password'
              : 'Please login to continue'}
        </p>

        {resetSuccess ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-green-800">
              <p className="font-semibold">Password reset successful</p>
              <p className="text-sm mt-1">Use the new password below to log in again.</p>
            </div>

            <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
              <input readOnly value={formData.newPassword || formData.password} className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              <button type="button" onClick={handleCopy} className="ml-3 text-sm font-semibold text-green-600 hover:underline">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              type="button"
              onClick={goToLogin}
              className="w-full bg-[#10b981] hover:bg-[#0ea46f] text-white py-3 rounded-full font-semibold shadow-sm"
            >
              Go to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {mode === 'register' && (
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.645 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input name="name" placeholder="Full name" value={formData.name} onChange={handleChange} className="ml-3 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" required />
                </div>
              )}

              <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <input name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="ml-3 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              {(mode === 'login' || mode === 'register') && (
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 0-3 0-3a4 4 0 10-8 0v3m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg>
                  <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="ml-3 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" />
                </div>
              )}

              {mode === 'forgot' && (
                <>
                  <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Captcha</div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="font-mono text-xl tracking-[0.35em] text-gray-900 dark:text-white">{captchaValue}</span>
                      <button type="button" onClick={() => setCaptchaValue(generateCaptcha())} className="text-sm font-semibold text-green-600 hover:underline">
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 0-3 0-3a4 4 0 10-8 0v3m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg>
                    <input name="captchaInput" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter captcha" className="ml-3 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" required />
                  </div>

                  <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 0-3 0-3a4 4 0 10-8 0v3m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg>
                    <input name="newPassword" type="password" placeholder="New password" value={formData.newPassword} onChange={handleChange} className="ml-3 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100" required />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <button type="submit" disabled={loading} className="w-full bg-[#10b981] hover:bg-[#0ea46f] text-white py-3 rounded-full font-semibold shadow-sm">
                {loading
                  ? (mode === 'register' ? 'Signing up...' : mode === 'forgot' ? 'Resetting...' : 'Logging in...')
                  : (mode === 'register' ? 'Sign up' : mode === 'forgot' ? 'Reset password' : 'Login')}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          {mode === 'register' ? 'Already have an account?' : mode === 'forgot' ? 'Remember your password?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              if (mode === 'forgot') {
                goToLogin();
                return;
              }

              setMode(prev => prev === 'register' ? 'login' : 'register');
            }}
            className="text-green-600 hover:underline"
          >
            {mode === 'forgot' ? 'Back to login' : 'click here'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-sm text-green-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
