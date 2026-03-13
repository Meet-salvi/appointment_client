import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowLeft, Brain, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('Reset OTP sent to your email!');
            setStep('otp');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
        setStep('reset');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            toast.success('Password reset successful!');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    const stepConfig = {
        email: { title: 'Forgot Password', subtitle: 'Enter your email to receive a reset code.', icon: <Mail size={48} className="text-primary" /> },
        otp: { title: 'Enter Verification Code', subtitle: `We've sent a 6-digit code to ${email}`, icon: <ShieldCheck size={48} className="text-secondary" /> },
        reset: { title: 'Set New Password', subtitle: 'Create a strong password for your account.', icon: <KeyRound size={48} className="text-primary" /> },
    };

    const current = stepConfig[step];

    return (
        <div className="auth-wrapper relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                            <Brain className="text-primary" size={28} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Schedula<span className="text-primary">.</span></span>
                    </Link>
                </div>

                <div className="card glass relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] rounded-full pointer-events-none"></div>

                    {/* Progress indicator */}
                    <div className="flex gap-2 mb-6 justify-center">
                        {['email', 'otp', 'reset'].map((s, i) => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
                                ['email', 'otp', 'reset'].indexOf(step) >= i
                                    ? 'bg-primary w-10'
                                    : 'bg-white/10 w-6'
                            }`}></div>
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            {current.icon}
                        </div>
                        <h2 className="text-2xl font-bold">{current.title}</h2>
                        <p className="text-muted mt-2 text-sm">{current.subtitle}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'email' && (
                            <motion.form key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOtp} className="flex flex-col gap-5">
                                <div className="form-group flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <span className="input-icon group-focus-within:text-primary transition-colors"><Mail size={18} /></span>
                                        <input type="email" placeholder="you@example.com" className="pl-11 focus:ring-2 ring-primary/20" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 shadow-lg shadow-primary/20">
                                    {loading ? 'Sending...' : 'Send Reset Code'}
                                </button>
                            </motion.form>
                        )}

                        {step === 'otp' && (
                            <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                                <div className="form-group flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">6-Digit OTP</label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        className="text-center text-2xl tracking-[0.5em] font-bold h-16 focus:ring-2 ring-primary/20"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={otp.length !== 6} className="btn btn-primary w-full py-3 shadow-lg shadow-primary/20">
                                    Verify Code
                                </button>
                                <button type="button" onClick={() => setStep('email')} className="text-sm text-muted hover:text-primary text-center transition-colors flex items-center justify-center gap-1">
                                    <ArrowLeft size={14} /> Back to email
                                </button>
                            </motion.form>
                        )}

                        {step === 'reset' && (
                            <motion.form key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetPassword} className="flex flex-col gap-5">
                                <div className="form-group flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">New Password</label>
                                    <div className="relative group">
                                        <span className="input-icon group-focus-within:text-primary transition-colors"><Lock size={18} /></span>
                                        <input type="password" placeholder="••••••••" className="pl-11 focus:ring-2 ring-primary/20" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <span className="input-icon group-focus-within:text-primary transition-colors"><Lock size={18} /></span>
                                        <input type="password" placeholder="••••••••" className="pl-11 focus:ring-2 ring-primary/20" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 shadow-lg shadow-primary/20">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="text-center mt-6 border-t border-white/5 pt-6">
                        <p className="text-sm text-muted">
                            Remember your password? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign in</Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background-color: var(--bg-main);
          background-image: 
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
            radial-gradient(circle at bottom left, rgba(20, 184, 166, 0.05) 0%, transparent 60%);
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          z-index: 5;
        }
        .pl-11 { padding-left: 2.75rem; }
        .w-full { width: 100%; }
        .max-w-md { max-width: 28rem; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .gap-1\\.5 { gap: 0.375rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-5 { gap: 1.25rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-6 { margin-top: 1.5rem; }
        .ml-1 { margin-left: 0.25rem; }
        .pt-6 { padding-top: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .h-16 { height: 4rem; }
        .h-1\\.5 { height: 0.375rem; }
        .w-6 { width: 1.5rem; }
        .w-10 { width: 2.5rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-2xl { font-size: 1.5rem; }
        .inline-flex { display: inline-flex; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .tracking-tight { letter-spacing: -0.025em; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        .absolute { position: absolute; }
        .relative { position: relative; }
        .top-0 { top: 0; }
        .right-0 { right: 0; }
        .w-32 { width: 8rem; }
        .h-32 { height: 8rem; }
        .border { border-width: 1px; }
        .border-t { border-top-width: 1px; }
        .z-10 { z-index: 10; }
        .pointer-events-none { pointer-events: none; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .bg-primary\\/10 { background-color: rgba(20, 184, 166, 0.1); }
        .bg-primary\\/20 { background-color: rgba(20, 184, 166, 0.2); }
        .bg-secondary\\/10 { background-color: rgba(99, 102, 241, 0.1); }
        .bg-secondary\\/20 { background-color: rgba(99, 102, 241, 0.2); }
        .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1); }
        .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05); }
        .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1); }
        .text-gray-300 { color: #d1d5db; }
        .hover\\:underline:hover { text-decoration: underline; }
        .underline-offset-4 { text-underline-offset: 4px; }
        .transition-colors { transition-property: color, background-color, border-color; transition-duration: 150ms; }
        .transition-all { transition: all 500ms; }
        .duration-500 { transition-duration: 500ms; }
      `}</style>
        </div>
    );
};

export default ForgotPassword;
