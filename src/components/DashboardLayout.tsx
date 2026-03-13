import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu,
    LogOut,
    User,
    Bell,
    Activity,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    role?: string;
}

const DashboardLayout: React.FC<{ children: React.ReactNode, items: SidebarItem[] }> = ({ children, items }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const notifications = [
        { id: 1, title: 'Welcome to MedPulse', message: 'Your health journey starts here! Explore our features.', time: 'Just now', type: 'info' },
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Auto close mobile sidebar on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Auto collapse sidebar on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="dashboard-wrapper bg-[#0B0E14] text-white overflow-hidden flex h-screen relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="mobile-overlay"
                    ></motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: sidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`sidebar glass flex flex-col border-r border-white/5 relative z-20 shadow-2xl bg-[#0F131A]/80 backdrop-blur-xl shrink-0 ${mobileOpen ? 'mobile-sidebar-open' : ''}`}
            >
                <div className="sidebar-header flex items-center justify-between p-6 h-20 border-b border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary/20 p-2 rounded-xl shrink-0">
                            <Activity className="text-primary" size={24} />
                        </div>
                        {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl whitespace-nowrap">MedPulse<span className="text-primary">.</span></motion.span>}
                    </div>
                </div>

                <div className="mt-4 px-4 flex justify-end">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors desktop-toggle">
                        <Menu size={20} />
                    </button>
                    <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors mobile-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav p-4 flex flex-col gap-2 mt-2 flex-1 overflow-y-auto">
                    {items.map((item, index) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/patient' && item.path !== '/doctor');
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`nav-item flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary text-white' : 'hover:bg-white/5 text-muted hover:text-white'}`}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <span className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary-light'}`}>
                                    {item.icon}
                                </span>
                                {sidebarOpen && <span className="whitespace-nowrap font-medium">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="sidebar-footer p-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-error/10 hover:text-error w-full transition text-muted group"
                        title={!sidebarOpen ? "Sign Out" : ""}
                    >
                        <LogOut size={20} className="shrink-0 group-hover:text-error transition-colors" />
                        {sidebarOpen && <span className="whitespace-nowrap font-medium">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="main-area flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full min-w-0">
                {/* Top Header */}
                <header className="main-header flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5 bg-[#0B0E14]/60 backdrop-blur-md sticky top-0 z-30 h-20">
                    <div className="breadcrumb flex items-center gap-2">
                        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white group flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-white/5 rounded-lg text-muted mobile-menu-btn">
                                <Menu size={20} />
                            </button>
                            {items.find(i => location.pathname === i.path || (location.pathname.startsWith(i.path) && i.path !== '/patient' && i.path !== '/doctor'))?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="header-actions flex items-center gap-3 sm:gap-6">
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className={`p-2 hover:bg-white/5 rounded-full cursor-pointer transition relative group ${notificationsOpen ? 'bg-white/10 text-primary' : 'text-muted'}`}
                            >
                                <Bell size={20} className="group-hover:text-primary transition-colors" />
                                {notifications.length > 0 && (
                                    <span className="notification-badge bg-error w-2.5 h-2.5 absolute top-1 right-2 rounded-full border-2 border-[#0B0E14] shadow-sm shadow-error/50"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-80 bg-[#0F131A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                                <h3 className="font-bold text-sm">Notifications</h3>
                                                <span className="text-[10px] bg-primary/20 text-primary-light px-2 py-0.5 rounded-full font-bold uppercase">{notifications.length} New</span>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center flex flex-col items-center gap-2">
                                                        <Bell size={24} className="text-muted/30" />
                                                        <p className="text-xs text-muted">All caught up!</p>
                                                    </div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n.id} className="p-4 hover:bg-white/[0.03] border-b border-white/5 transition-colors cursor-pointer group/notif">
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                    <Activity size={14} className="text-primary-light" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-bold text-white group-hover/notif:text-primary-light transition-colors">{n.title}</p>
                                                                    <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
                                                                    <p className="text-[10px] text-muted/50 mt-2 font-mono">{n.time}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="p-3 bg-white/[0.01] text-center border-t border-white/5">
                                                <button className="text-[11px] font-bold text-primary hover:text-primary-light uppercase tracking-wider">Mark all as read</button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="user-profile flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10 relative group cursor-pointer">
                            <div className="text-right hidden sm:block pt-1">
                                <p className="text-sm font-bold text-white leading-tight">{user?.full_name || 'User'}</p>
                                <p className="text-xs text-primary font-medium leading-tight mt-0.5">{user?.role === 'PATIENT' ? 'Patient Portal' : 'Doctor Portal'}</p>
                            </div>
                            <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20 shrink-0 mt-1">
                                <User size={20} className="text-primary-light" />
                            </div>

                            {/* Hover Dropdown */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0F131A] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-error/10 text-muted hover:text-error w-full transition text-left group/btn"
                                >
                                    <LogOut size={16} className="group-hover/btn:text-error transition-colors" />
                                    <span className="font-medium text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="content-scroll flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-7xl mx-auto w-full pb-10"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.4);
        }
        .text-error { color: var(--error); }
        .bg-error { background-color: var(--error); }
        .bg-error\\/10 { background-color: rgba(244, 63, 94, 0.1); }
        
        .mobile-overlay {
          display: none;
        }
        .mobile-close-btn {
          display: none;
        }
        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar { 
            position: fixed;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 60;
            width: 280px !important;
            transition: left 0.3s ease;
          }
          .sidebar.mobile-sidebar-open {
            left: 0 !important;
          }
          .desktop-toggle {
            display: none;
          }
          .mobile-close-btn {
            display: block;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 55;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .content-scroll {
            padding: 0.75rem !important;
          }
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
