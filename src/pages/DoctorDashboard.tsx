import { Routes, Route, Navigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    Clock,
    ClipboardCheck,
    Activity,
    LayoutDashboard,
    User,
    PlusCircle,
    TrendingUp,
    Settings,
    X,
    Filter
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Custom hook: fetch doctor profile (doctorId) from userId
const useDoctorProfile = () => {
    const { user } = useAuth();
    const [doctorProfile, setDoctorProfile] = useState<any>(null);

    useEffect(() => {
        if (!user) return;
        api.get('/doctors/me').then(res => setDoctorProfile(res.data)).catch(console.error);
    }, [user]);

    return { user, doctorProfile, doctorId: doctorProfile?.id };
};

const DoctorOverview = () => {
    const { doctorId } = useDoctorProfile();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

    // Elastic Modals
    const [showModal, setShowModal] = useState(false);
    const [elasticForm, setElasticForm] = useState({ start_time: '09:00', end_time: '17:00', schedule_type: 'WAVE' });

    const fetchSchedule = async () => {
        try {
            const res = await api.get(`/appointments/doctor-schedule?date=${today}`);
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [today]);

    const handleApplyElastic = async () => {
        if (!doctorId) { toast.error('Doctor profile not loaded yet'); return; }
        try {
            const endpoint = elasticForm.schedule_type === 'WAVE' ? '/doctor-availability/elastic/wave' : '/doctor-availability/elastic/stream';
            const res = await api.post(endpoint, {
                doctorId: doctorId,
                date: today,
                start_time: elasticForm.start_time,
                end_time: elasticForm.end_time
            });
            toast.success(res.data.message || "Session adjusted successfully!");
            setShowModal(false);
            fetchSchedule();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to adjust session");
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02] flex flex-col gap-3 p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] rounded-full group-hover:bg-primary/20 transition-colors"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="bg-primary/20 p-2.5 rounded-xl"><Users size={22} className="text-primary-light" /></div>
                        <p className="text-2xl font-extrabold text-white">{appointments.reduce((sum, a) => sum + a.total_patients, 0)}</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted">Total Patients Today</p>
                        <p className="text-xs text-primary font-bold flex items-center gap-1 mt-1"><TrendingUp size={12} /> Scheduled</p>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02] flex flex-col gap-3 p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-[30px] rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="bg-secondary/20 p-2.5 rounded-xl"><Clock size={22} className="text-secondary" /></div>
                        <p className="text-2xl font-extrabold text-white">{appointments.length}</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted">Time Slots</p>
                        <p className="text-xs text-secondary/80 font-bold mt-1">Active sessions today</p>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02] flex flex-col gap-3 p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 blur-[30px] rounded-full group-hover:bg-success/20 transition-colors"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="bg-success/20 p-2.5 rounded-xl"><ClipboardCheck size={22} className="text-success" /></div>
                        <p className="text-2xl font-extrabold text-white">{today}</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted">Selected Date</p>
                        <p className="text-xs text-success/80 font-bold mt-1">Current view</p>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02] flex flex-col gap-3 p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[30px] rounded-full group-hover:bg-orange-500/20 transition-colors"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="bg-orange-500/20 p-2.5 rounded-xl"><Activity size={22} className="text-orange-400" /></div>
                        <p className="text-2xl font-extrabold text-white">{elasticForm.schedule_type}</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted">Schedule Strategy</p>
                        <p className="text-xs text-orange-400 font-bold mt-1">Current mode</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col gap-5 mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5 backdrop-blur-md">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Calendar className="text-primary" size={20} /> Today's Schedule</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowModal(true)} className="btn btn-outline border-white/10 btn-sm text-xs flex items-center gap-2 text-primary group hover:border-primary/50">
                            <Filter size={14} className="group-hover:text-primary-light" /> Adjust Session Time
                        </button>
                        <div className="relative group">
                            <input
                                type="date"
                                className="text-sm px-4 py-2 w-full sm:w-40 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary/40 focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                value={today}
                                onChange={(e) => setToday(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Elastic Scheduling Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0F131A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="text-primary" size={20} /> Elastic Scheduling</h3>
                                <button onClick={() => setShowModal(false)} className="text-muted hover:text-white"><X size={20} /></button>
                            </div>
                            <p className="text-sm text-muted mb-5 leading-relaxed">Adjust your capacity or time temporarily for <strong className="text-primary-light">{today}</strong>. This only affects today's session.</p>
                            
                            <div className="flex flex-col gap-4">
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Schedule Strategy</label>
                                    <select 
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none"
                                        value={elasticForm.schedule_type}
                                        onChange={(e) => setElasticForm({...elasticForm, schedule_type: e.target.value})}
                                    >
                                        <option value="WAVE" className="bg-[#0F131A]">Wave Scheduling (Batches of Patients)</option>
                                        <option value="STREAM" className="bg-[#0F131A]">Stream Scheduling (Sequential Slots)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-300">New Start Time</label>
                                        <input 
                                            type="time" 
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                            value={elasticForm.start_time}
                                            onChange={(e) => setElasticForm({...elasticForm, start_time: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-300">New End Time</label>
                                        <input 
                                            type="time" 
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                            value={elasticForm.end_time}
                                            onChange={(e) => setElasticForm({...elasticForm, end_time: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleApplyElastic} className="btn btn-primary w-full mt-2 py-3 shadow-lg shadow-primary/20">Apply Adjustment</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {loading ? [1, 2].map(i => <div key={i} className="card h-40 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>) :
                        appointments.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-3">
                                <div className="bg-white/5 p-4 rounded-full text-muted"><Calendar size={32} /></div>
                                <p className="text-muted text-lg">No appointments scheduled for selected date.</p>
                            </div>
                        ) :
                            appointments.map((group, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="card flex flex-col gap-5 border border-white/5 bg-white/[0.02] rounded-2xl p-6 relative overflow-hidden group"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary"></div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg"><Clock size={18} className="text-primary-light" /></div>
                                            <span className="font-extrabold text-xl text-white tracking-wide">{group.start_time?.slice(0,5)} - {group.end_time?.slice(0,5)}</span>
                                        </div>
                                        <span className="bg-primary/20 text-primary-light px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20 shadow-lg shadow-primary/10">
                                            {group.total_patients} Patients
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {group.patients.map((p: any, j: number) => (
                                            <div key={j} className="flex-1 bg-white/[0.03] border border-white/10 hover:border-primary/40 p-4 rounded-xl flex items-center justify-between transition-colors group/patient cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center font-bold text-primary border border-white/5 shadow-inner">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-md text-white group-hover/patient:text-primary-light transition-colors">{p.name}</p>
                                                        <p className="text-xs text-muted font-mono mt-0.5">Tk: <span className="text-white">#{p.token}</span> • {p.reporting_time?.slice(0,5)}</p>
                                                    </div>
                                                </div>
                                                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-muted hover:bg-primary/20 hover:text-primary-light transition-all border border-white/5 hover:border-primary/30" title="Mark Complete">
                                                    <ClipboardCheck size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

const Availability = () => {
    const { doctorId } = useDoctorProfile();
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        type: 'recurring', // 'recurring' or 'custom'
        day_of_week: 'Monday',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        schedule_type: 'WAVE',
        interval_minutes: 30,
        capacity: 3,
        is_available: true
    });

    const fetchAvailability = async () => {
        if (!doctorId) return;
        try {
            const res = await api.get(`/doctor-availability/${doctorId}`);
            setAvailabilities(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctorId) fetchAvailability();
    }, [doctorId]);

    const handleAddAvailability = async () => {
        if (!doctorId) return;
        try {
            if (addForm.type === 'recurring') {
                await api.post(`/doctor-availability/recurring/${doctorId}`, {
                    day_of_week: addForm.day_of_week,
                    start_time: addForm.start_time + ':00',
                    end_time: addForm.end_time + ':00',
                    schedule_type: addForm.schedule_type,
                    interval_minutes: addForm.interval_minutes,
                    capacity: addForm.capacity,
                    is_available: addForm.is_available
                });
            } else {
                await api.post(`/doctor-availability/custom/${doctorId}`, {
                    date: addForm.date,
                    start_time: addForm.start_time + ':00',
                    end_time: addForm.end_time + ':00',
                    schedule_type: addForm.schedule_type,
                    interval_minutes: addForm.interval_minutes,
                    capacity: addForm.capacity,
                    is_available: addForm.is_available
                });
            }
            toast.success('Availability added successfully!');
            setShowAddModal(false);
            fetchAvailability();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add availability');
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5 backdrop-blur-md">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Settings className="text-secondary" size={20} /> Manage Availability</h3>
                <button className="btn btn-primary btn-sm flex items-center gap-2 shadow-lg shadow-primary/20" onClick={() => setShowAddModal(true)}>
                    <PlusCircle size={18} /> Add Availability
                </button>
            </div>

            {/* Add Availability Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0F131A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><PlusCircle className="text-primary" size={20} /> Add Availability</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="form-group flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Type</label>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                                    value={addForm.type}
                                    onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                                >
                                    <option value="recurring" className="bg-[#0F131A]">Recurring (Weekly)</option>
                                    <option value="custom" className="bg-[#0F131A]">Custom (Specific Date)</option>
                                </select>
                            </div>

                            {addForm.type === 'recurring' ? (
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Day of Week</label>
                                    <select
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
                                        value={addForm.day_of_week}
                                        onChange={(e) => setAddForm({ ...addForm, day_of_week: e.target.value })}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                            <option key={d} value={d} className="bg-[#0F131A]">{d}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Date</label>
                                    <input type="date" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Start Time</label>
                                    <input type="time" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" value={addForm.start_time} onChange={(e) => setAddForm({ ...addForm, start_time: e.target.value })} />
                                </div>
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">End Time</label>
                                    <input type="time" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" value={addForm.end_time} onChange={(e) => setAddForm({ ...addForm, end_time: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Schedule Type</label>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none" value={addForm.schedule_type} onChange={(e) => setAddForm({ ...addForm, schedule_type: e.target.value })}>
                                    <option value="WAVE" className="bg-[#0F131A]">Wave (Batched Patients)</option>
                                    <option value="STREAM" className="bg-[#0F131A]">Stream (Sequential 1-by-1)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Interval (mins)</label>
                                    <input type="number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none" value={addForm.interval_minutes} onChange={(e) => setAddForm({ ...addForm, interval_minutes: Number(e.target.value) })} />
                                </div>
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Capacity</label>
                                    <input type="number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none" value={addForm.capacity} onChange={(e) => setAddForm({ ...addForm, capacity: Number(e.target.value) })} />
                                </div>
                            </div>

                            <button onClick={handleAddAvailability} className="btn btn-primary w-full mt-2 py-3 shadow-lg shadow-primary/20">Save Availability</button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? [1, 2, 3].map(i => <div key={i} className="card h-40 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>) : 
                availabilities.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                        <p className="text-muted text-lg">No availability data found. Click "Add Availability" to start.</p>
                    </div>
                ) :
                availabilities.map((avail, i) => (
                    <motion.div
                        whileHover={{ y: -4 }}
                        key={avail.id || i}
                        className="card flex flex-col gap-4 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors p-5 rounded-2xl"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center rounded-xl font-extrabold text-lg text-white shadow-inner uppercase tracking-wide">
                                    {avail.date ? avail.date.slice(8,10) : avail.day_of_week?.slice(0, 3)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">{avail.date || avail.day_of_week}</p>
                                    <p className={`text-xs font-medium flex items-center gap-1 mt-0.5 ${avail.is_available ? 'text-success' : 'text-red-500'}`}>
                                        <div className={`w-2 h-2 rounded-full ${avail.is_available ? 'bg-success' : 'bg-red-500'}`}></div> {avail.is_available ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={avail.is_available} readOnly className="sr-only peer" />
                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                </label>
                            </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between mt-2">
                            <span className="text-sm font-mono text-muted">{avail.start_time?.slice(0,5)} - {avail.end_time?.slice(0,5)}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${avail.schedule_type === 'WAVE' ? 'bg-primary/20 text-primary-light border border-primary/20' : 'bg-secondary/20 text-secondary border border-secondary/20'}`}>
                                {avail.schedule_type}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted">
                            <span>Interval: <strong className="text-white">{avail.interval_minutes} min</strong></span>
                            <span>Capacity: <strong className="text-white">{avail.capacity}</strong></span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Patient Logs — All past patients who booked with this doctor
const PatientLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const todayDate = new Date().toISOString().split('T')[0];
                const res = await api.get(`/appointments/doctor-schedule?date=${todayDate}`);
                setLogs(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const allPatients = logs.flatMap(g => g.patients);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5 backdrop-blur-md">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white"><Users className="text-primary" size={20} /> Patient Logs</h3>
                <p className="text-muted text-sm mt-1">All patients who have active appointments with you today.</p>
            </div>

            {loading ? [1, 2, 3].map(i => <div key={i} className="card h-20 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>) :
                allPatients.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-3">
                        <div className="bg-white/5 p-4 rounded-full text-muted"><Users size={32} /></div>
                        <p className="text-muted text-lg">No patient logs found for today.</p>
                    </div>
                ) :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allPatients.map((p: any, i: number) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} className="bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center font-bold text-xl text-primary border border-primary/20">
                                {p.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white">{p.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">Token: <strong className="text-white">#{p.token}</strong></span>
                                    <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">Report: <strong className="text-white">{p.reporting_time?.slice(0,5)}</strong></span>
                                </div>
                            </div>
                            <span className="bg-primary/20 text-primary-light px-3 py-1 rounded-full text-xs font-bold border border-primary/20">Active</span>
                        </motion.div>
                    ))}
                </div>
            }
        </div>
    );
};

// Doctor Profile
const DoctorProfile = () => {
    const { user, doctorProfile } = useDoctorProfile();

    return (
        <div className="card max-w-2xl mx-auto flex flex-col gap-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-white border-2 border-primary/30 shadow-xl shadow-primary/20">
                        <User size={40} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-[#0F131A] shadow-lg"></div>
                </div>
                <div>
                    <h3 className="text-3xl font-extrabold text-white">{user?.full_name}</h3>
                    <p className="text-primary mt-1 font-medium">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-muted">Doctor Account</span>
                        {doctorProfile?.specialization?.name && (
                            <span className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-bold text-primary-light">{doctorProfile.specialization.name}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 relative z-10">
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Full Name</label>
                    <input value={user?.full_name || ''} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Email</label>
                    <input value={user?.email || ''} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Experience</label>
                    <input value={doctorProfile?.experience_years ? `${doctorProfile.experience_years} Years` : 'N/A'} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Consultation Fee</label>
                    <input value={doctorProfile?.consultation_fee ? `$${doctorProfile.consultation_fee}` : 'N/A'} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Qualification</label>
                    <input value={doctorProfile?.qualification || 'N/A'} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Clinic</label>
                    <input value={doctorProfile?.clinic?.name || 'Not assigned'} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70 rounded-xl px-4 py-2.5" />
                </div>
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/doctor' },
        { icon: <Calendar size={20} />, label: 'Availability', path: '/doctor/availability' },
        { icon: <Users size={20} />, label: 'Patient Logs', path: '/doctor/patients' },
        { icon: <User size={20} />, label: 'Profile Options', path: '/doctor/profile' },
    ];

    return (
        <DashboardLayout items={sidebarItems}>
            <Routes>
                <Route index element={<DoctorOverview />} />
                <Route path="availability" element={<Availability />} />
                <Route path="patients" element={<PatientLogs />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="*" element={<Navigate to="" />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
