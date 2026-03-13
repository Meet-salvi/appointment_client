import { Link } from 'react-router-dom';
import { Shield, Brain, Calendar, Clock, ArrowRight, Github, Activity, HeartPulse, Stethoscope, Eye, Bone, Baby, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
    const features = [
        {
            icon: <Brain size={28} className="text-secondary" />,
            title: 'AI Scheduling',
            description: 'Intelligently manages doctor availability and predicts ideal slots for patients taking away the guessing game.',
        },
        {
            icon: <Shield size={28} className="text-primary" />,
            title: 'Ironclad Privacy',
            description: 'HIPAA-compliant architecture with end-to-end encryption for all your sensitive medical records.',
        },
        {
            icon: <Calendar size={28} className="text-secondary" />,
            title: 'Instant Booking',
            description: 'Zero wait times. Reserve your appointment natively in seconds with live-syncing slots.',
        },
    ];

    const { user, logout } = useAuth();

    const categories = [
        { name: 'Cardiology', icon: <HeartPulse size={32} />, count: '120+ Doctors' },
        { name: 'Neurology', icon: <Brain size={32} />, count: '85+ Doctors' },
        { name: 'General', icon: <Stethoscope size={32} />, count: '300+ Doctors' },
        { name: 'Orthopedics', icon: <Bone size={32} />, count: '94+ Doctors' },
        { name: 'Pediatrics', icon: <Baby size={32} />, count: '150+ Doctors' },
        { name: 'Ophthalmology', icon: <Eye size={32} />, count: '76+ Doctors' },
    ];

    return (
        <div className="home-container">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="navbar container pt-4 sm:pt-6 pb-4 flex-wrap gap-y-4"
            >
                <div className="logo flex items-center gap-3">
                    <div className="logo-icon-wrap bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                        <Activity className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">MedPulse<span className="text-primary">.</span></span>
                </div>
                <div className="nav-links flex gap-2 sm:gap-4 flex-wrap justify-end">
                    {user ? (
                        <>
                            <Link to={user.role === 'PATIENT' ? '/patient' : '/doctor'} className="btn btn-outline hover:bg-white/5 border-white/10 text-white flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm">
                                <LayoutDashboard size={14} className="sm:w-[18px]" /> Dashboard
                            </Link>
                            <button onClick={logout} className="btn btn-primary shadow-lg shadow-primary/30 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm">
                                <LogOut size={14} className="sm:w-[18px]" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline hover:bg-white/5 border-white/10 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary shadow-lg shadow-primary/30 px-3 sm:px-4 py-2 text-xs sm:text-sm">
                                Join Now
                            </Link>
                        </>
                    )}
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="hero container">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="badge-wrap mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Smart Healthcare Platform
                        </div>
                        <h1 className="hero-title text-5xl md:text-6xl font-extrabold leading-tight mb-6 mt-0">
                            Find & Book <br />
                            <span className="text-gradient">Top Doctors</span> Instantly.
                        </h1>
                        <p className="hero-description text-muted text-lg mb-8 max-w-lg">
                            Connect with world-class medical professionals through an intelligent, seamlessly integrated appointment ecosystem. Your health journey begins here.
                        </p>
                        <div className="hero-buttons flex gap-5 items-center flex-wrap">
                            <Link to="/signup" className="btn btn-primary btn-lg group px-8 py-4 shadow-xl shadow-primary/20">
                                Book Appointment
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="flex -space-x-4 border-l border-white/10 pl-5 ml-2 hidden sm:flex">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} className="w-10 h-10 border-2 border-[#0B0E14] rounded-full object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Patient" />
                                ))}
                                <div className="w-10 h-10 border-2 border-[#0B0E14] rounded-full bg-white/10 flex items-center justify-center text-xs font-bold backdrop-blur-sm z-10">
                                    +2k
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-image relative hidden md:flex">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="gradient-blob"
                    ></motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 2 }}
                        transition={{ duration: 0.8 }}
                        className="hero-card glass flex flex-col gap-5 p-7 relative z-10 w-[380px] border border-white/10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="font-semibold flex items-center gap-2 text-white/90">
                                <Calendar size={18} className="text-primary" /> Upcoming Visit
                            </span>
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">Confirmed</span>
                        </div>
                        <div className="flex gap-5 items-center">
                            <div className="avatar w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/20 p-1 bg-white/5">
                                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" alt="Doctor" className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-white">Dr. Sarah Johnson</p>
                                <p className="text-sm text-primary font-medium tracking-wide">Cardiology Specialist</p>
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
                                    <Clock size={14} /> Today, 2:00 PM
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Menu */}
            <section className="categories container py-16 relative z-10 border-y border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Medical Specialties</h2>
                        <p className="text-muted">Find experts across all medical fields</p>
                    </div>
                    <Link to="/signup" className="text-primary hover:text-primary-light font-medium flex items-center gap-1 group hidden sm:flex">
                        View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02] cursor-pointer transition-all group"
                        >
                            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white shadow-lg shadow-primary/5">
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white group-hover:text-primary-light transition-colors">{cat.name}</h3>
                                <p className="text-xs text-muted mt-1">{cat.count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features container py-24 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-primary">Schedula</span>?</h2>
                    <p className="text-muted text-lg">
                        We provide state-of-the-art tools to make your healthcare journey accessible, highly efficient, and absolutely secure.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="card feature-card flex flex-col gap-4 relative overflow-hidden group border border-white/5 bg-white/[0.02] backdrop-blur-md"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="feature-icon w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl shadow-lg relative z-10 text-primary">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold relative z-10 mt-2 text-white">{f.title}</h3>
                            <p className="text-muted leading-relaxed relative z-10">{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer border-t border-white/10 py-10 relative z-10 bg-black/40 backdrop-blur-xl">
                <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="logo flex items-center gap-3">
                        <Activity className="text-primary" size={24} />
                        <span className="font-bold text-lg text-white">Schedula</span>
                    </div>
                    <p className="text-sm text-muted">© 2026 Schedula Technologies. All rights reserved.</p>
                    <div className="social flex gap-5">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:border-white/30">
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </footer>

            <style>{`
        .home-container {
          min-height: 100vh;
          overflow-x: hidden;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 5rem;
          padding-bottom: 7rem;
          gap: 4rem;
          min-height: 80vh;
        }
        .hero-content {
          flex: 1.2;
          z-index: 10;
        }
        .hero-image {
          flex: 0.8;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .gradient-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: conic-gradient(from 0deg, var(--primary) 0%, var(--secondary) 30%, transparent 60%, var(--primary) 100%);
          filter: blur(80px);
          opacity: 0.25;
          border-radius: 50%;
          z-index: 0;
        }
        .hero-card {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .feature-card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: 1fr; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 768px) {
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
          .md\\:flex { display: flex; }
        }
        @media (min-width: 1024px) {
          .lg\\:grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
        }
        .gap-1 { gap: 0.25rem; }
        .gap-1\\.5 { gap: 0.375rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-5 { gap: 1.25rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .items-center { align-items: center; }
        .items-end { align-items: flex-end; }
        .flex { display: flex; }
        .flex-wrap { flex-wrap: wrap; }
        .flex-col { flex-direction: column; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .mt-0 { margin-top: 0; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-16 { margin-bottom: 4rem; }
        .ml-2 { margin-left: 0.5rem; }
        .pl-5 { padding-left: 1.25rem; }
        .pt-6 { padding-top: 1.5rem; }
        .pb-4 { padding-bottom: 1rem; }
        .p-1 { padding: 0.25rem; }
        .p-2 { padding: 0.5rem; }
        .p-2\\.5 { padding: 0.625rem; }
        .p-6 { padding: 1.5rem; }
        .p-7 { padding: 1.75rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
        .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
        .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .max-w-lg { max-width: 32rem; }
        .max-w-2xl { max-width: 42rem; }
        .w-2 { width: 0.5rem; }
        .h-2 { height: 0.5rem; }
        .w-10 { width: 2.5rem; }
        .h-10 { height: 2.5rem; }
        .w-14 { width: 3.5rem; }
        .h-14 { height: 3.5rem; }
        .w-16 { width: 4rem; }
        .h-16 { height: 4rem; }
        .w-32 { width: 8rem; }
        .h-32 { height: 8rem; }
        .w-\\[380px\\] { width: 380px; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .object-cover { object-fit: cover; }
        .overflow-hidden { overflow: hidden; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .top-0 { top: 0; }
        .right-0 { right: 0; }
        .z-10 { z-index: 10; }
        .rounded-full { border-radius: 9999px; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .border { border-width: 1px; }
        .border-2 { border-width: 2px; }
        .border-l { border-left-width: 1px; }
        .border-b { border-bottom-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-y { border-top-width: 1px; border-bottom-width: 1px; }
        .cursor-pointer { cursor: pointer; }
        
        .bg-white\\/\\[0\\.02\\] { background-color: rgba(255, 255, 255, 0.02); }
        .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
        .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1); }
        .bg-black\\/40 { background-color: rgba(0, 0, 0, 0.4); }
        .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05); }
        .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1); }
        .border-white\\/30 { border-color: rgba(255, 255, 255, 0.3); }
        
        .text-white { color: white; }
        .text-white\\/90 { color: rgba(255, 255, 255, 0.9); }
        
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .backdrop-blur-md { backdrop-filter: blur(12px); }
        .backdrop-blur-xl { backdrop-filter: blur(24px); }
        
        .-space-x-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-right: calc(-1rem * var(--tw-space-x-reverse)); margin-left: calc(-1rem * calc(1 - var(--tw-space-x-reverse))); }
        
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-5xl { font-size: 3rem; line-height: 1; }
        .font-bold { font-weight: 700; }
        .font-extrabold { font-weight: 800; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-wide { letter-spacing: 0.025em; }
        
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
        .shadow-primary\\/5 { --tw-shadow-color: rgba(20, 184, 166, 0.05); --tw-shadow: var(--tw-shadow-colored); }
        .shadow-primary\\/20 { --tw-shadow-color: rgba(20, 184, 166, 0.2); --tw-shadow: var(--tw-shadow-colored); }
        .shadow-primary\\/30 { --tw-shadow-color: rgba(20, 184, 166, 0.3); --tw-shadow: var(--tw-shadow-colored); }
        
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .duration-300 { transition-duration: 300ms; }
        .duration-500 { transition-duration: 500ms; }
        
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        
        .hidden { display: none; }
        @media (min-width: 640px) { .sm\\:flex { display: flex; } }
        @media (min-width: 768px) {
          .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
          .hero { flex-direction: row; padding-top: 6rem; padding-bottom: 8rem; }
          .hero-content { margin-right: auto; }
        }
        @media (max-width: 768px) {
          .hero { flex-direction: column; text-align: center; padding-top: 3rem; padding-bottom: 4rem; }
          .hero-title { font-size: 2.5rem; }
          .hero-description { margin-left: auto; margin-right: auto; font-size: 1rem; }
          .hero-buttons { justify-content: center; flex-direction: column; width: 100%; }
          .hero-buttons .btn { width: 100%; justify-content: center; }
          .navbar { justify-content: center; flex-direction: column; }
          .nav-links { width: 100%; justify-content: center; }
        }
      `}</style>
        </div>
    );
};

export default Home;
