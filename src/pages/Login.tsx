import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Brain, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/signin', { email, password });
            toast.success('Welcome back!');

            const { accessToken, role } = res.data;

            const userRes = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            login(accessToken, userRes.data);

            if (role === 'PATIENT') navigate('/patient');
            else if (role === 'DOCTOR') navigate('/doctor');
            else navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
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

                    <div className="text-center mb-8">
                        <div className="inline-flex justify-center items-center gap-2 mb-3 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold">
                            <Activity size={14} /> Secure Access
                        </div>
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-muted mt-2 text-sm">Enter your credentials to access your portal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><Mail size={18} /></span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><Lock size={18} /></span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-[-10px]">
                            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors">Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    <div className="text-center mt-6 border-t border-white/5 pt-6">
                        <p className="text-sm text-muted">
                            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">Sign up now</Link>
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
        .justify-end { justify-content: flex-end; }
        .text-center { text-align: center; }
        .gap-1\\.5 { gap: 0.375rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-5 { gap: 1.25rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-[-10px] { margin-top: -10px; }
        .mt-6 { margin-top: 1.5rem; }
        .ml-1 { margin-left: 0.25rem; }
        .pt-6 { padding-top: 1.5rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .inline-flex { display: inline-flex; }
        .font-semibold { font-weight: 600; }
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
        .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
        .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05); }
        .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1); }
        .z-10 { z-index: 10; }
        .pointer-events-none { pointer-events: none; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        
        .bg-primary\\/10 { background-color: rgba(20, 184, 166, 0.1); }
        .bg-primary\\/20 { background-color: rgba(20, 184, 166, 0.2); }
        .bg-secondary\\/10 { background-color: rgba(99, 102, 241, 0.1); }
        .bg-secondary\\/20 { background-color: rgba(99, 102, 241, 0.2); }
        .border-primary\\/20 { border-color: rgba(20, 184, 166, 0.2); }
        .text-gray-300 { color: #d1d5db; }
        
        .hover\\:underline:hover { text-decoration: underline; }
        .underline-offset-4 { text-underline-offset: 4px; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
        .ring-primary\\/20 { --tw-ring-color: rgba(20, 184, 166, 0.2); }
      `}</style>
        </div>
    );
};

export default Login;
