import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as any)?.email;

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            toast.success('Email verified successfully! You can now sign in.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setResending(true);
        try {
            await api.post('/auth/resend-otp', { email });
            toast.success('A new OTP has been sent to your email.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Resend failed');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-wrapper glass-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card auth-card text-center"
            >
                <div className="mb-6">
                    <div className="flex justify-center mb-4">
                        <MailCheck className="text-primary" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold">Verify Your Email</h2>
                    <p className="text-muted mt-2">
                        We've sent a 6-digit code to <strong>{email}</strong>.
                        Please enter it below to complete your registration.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="otp-input text-center text-2xl tracking-[1rem]"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="btn btn-primary w-full"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className="mt-8">
                    <p className="text-sm text-muted">
                        Didn't receive the code?
                        <button
                            onClick={resendOtp}
                            disabled={resending}
                            className="text-primary font-bold ml-2 flex items-center gap-1 inline-flex"
                        >
                            <RefreshCcw size={14} className={resending ? 'animate-spin' : ''} />
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </p>
                </div>
            </motion.div>

            <style>{`
        .otp-input {
          font-weight: 700;
          height: 4rem;
          border-width: 2px;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 480px) {
          .auth-wrapper {
            padding: 1rem;
          }
          .card {
            padding: 1.5rem !important;
          }
          .text-2xl {
            font-size: 1.25rem;
          }
          .otp-input {
            letter-spacing: 0.5rem;
            font-size: 1.5rem;
            height: 3.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default VerifyOtp;
