import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-vh-100 p-8 glass-bg h-screen w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card flex flex-col items-center gap-6 max-w-md text-center"
            >
                <div className="bg-error/10 p-6 rounded-full"><ShieldAlert size={64} className="text-error" /></div>
                <h1 className="text-3xl font-bold">Access Denied</h1>
                <p className="text-muted">You do not have permission to view this page. Please contact your administrator if you think this is a mistake.</p>
                <Link to="/" className="btn btn-primary flex items-center gap-2"><ArrowLeft size={20} /> Back to Safety</Link>
            </motion.div>
        </div>
    );
};

export default Unauthorized;
