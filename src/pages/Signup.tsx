import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'PATIENT',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/signup', formData);
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>

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
                            <Activity className="text-primary" size={28} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">MedPulse<span className="text-primary">.</span></span>
                    </Link>
                </div>

                <div className="card glass relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="text-center mb-8">
                        <div className="inline-flex justify-center items-center gap-2 mb-3 bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-semibold">
                            <Activity size={14} /> Join the network
                        </div>
                        <h2 className="text-3xl font-bold">Create Account</h2>
                        <p className="text-muted mt-2 text-sm">Experience the future of healthcare today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><User size={18} /></span>
                                <input
                                    name="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><Mail size={18} /></span>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Phone <span className="text-muted font-normal">(Optional)</span></label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><Phone size={18} /></span>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <span className="input-icon group-focus-within:text-primary transition-colors"><Lock size={18} /></span>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11 focus:ring-2 ring-primary/20"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Account Type</label>
                            <select
                                name="role"
                                className="cursor-pointer focus:ring-2 ring-primary/20"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="PATIENT">Patient (Looking for care)</option>
                                <option value="DOCTOR">Doctor (Offering care)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2 py-3 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6 border-t border-white/5 pt-6">
                        <p className="text-sm text-muted">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign in here</Link>
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
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
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
        .font-normal { font-weight: 400; }
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
        .border-secondary\\/20 { border-color: rgba(99, 102, 241, 0.2); }
        .text-gray-300 { color: #d1d5db; }
        
        @media (max-width: 480px) {
          .auth-wrapper {
            padding: 1rem;
          }
          .card {
            padding: 1.5rem !important;
          }
          .text-3xl {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Signup;
