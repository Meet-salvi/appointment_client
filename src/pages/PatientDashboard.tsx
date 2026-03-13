import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    History,
    User,
    Calendar,
    Clock,
    CheckCircle,
    ArrowRight,
    Stethoscope,
    MapPin,
    Star,
    Activity,
    X,
    Mail,
    Phone,
    DollarSign
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Overview = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppts = async () => {
        try {
            const res = await api.get('/appointments/my-appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppts();
    }, []);

    const handleCancel = async (id: number) => {
        const result = await Swal.fire({
            title: 'Cancel Appointment?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, cancel it!',
            background: '#0F131A',
            color: '#ffffff',
            customClass: {
                popup: 'border border-white/10 rounded-2xl shadow-2xl',
            }
        });

        if (!result.isConfirmed) return;

        try {
            await api.post(`/appointments/cancel/${id}`);
            toast.success("Appointment cancelled successfully!");
            fetchAppts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] rounded-full group-hover:bg-primary/20 transition-colors"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-primary/20 p-4 rounded-2xl shadow-lg shadow-primary/20">
                            <Calendar className="text-primary-light" size={28} />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-medium">Upcoming Visits</p>
                            <p className="text-3xl font-extrabold text-white mt-1">{appointments.filter(a => a.status === 'BOOKED').length}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-[30px] rounded-full group-hover:bg-secondary/20 transition-colors"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-secondary/20 p-4 rounded-2xl shadow-lg shadow-secondary/20">
                            <History className="text-secondary" size={28} />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-medium">Total History</p>
                            <p className="text-3xl font-extrabold text-white mt-1">{appointments.length}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card glass relative overflow-hidden group border border-white/5 bg-white/[0.02]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 blur-[30px] rounded-full group-hover:bg-success/20 transition-colors"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-success/20 p-4 rounded-2xl shadow-lg shadow-success/20">
                            <CheckCircle className="text-success" size={28} />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-medium">Completed</p>
                            <p className="text-3xl font-extrabold text-white mt-1">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col gap-5 mt-4">
                <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5 backdrop-blur-md">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="text-primary" size={20} /> Upcoming Appointments</h3>
                    <Link to="/patient/appointments" className="text-primary hover:text-primary-light text-sm font-bold flex items-center gap-1 group transition-colors">
                        View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {loading ? [1, 2, 3].map(i => <div key={i} className="card h-28 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>) :
                        appointments.length === 0 ? (
                            <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center gap-4">
                                <div className="bg-white/5 p-4 rounded-full text-muted"><Calendar size={32} /></div>
                                <p className="text-muted">No upcoming appointments found.</p>
                                <Link to="/patient/doctors" className="btn btn-primary mt-2">Find a Doctor</Link>
                            </div>
                        ) :
                            appointments.map((appt, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.01 }} className="card flex flex-col gap-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer rounded-2xl p-5">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div className="flex items-start gap-5">
                                            <div className="date-badge flex flex-col items-center justify-center bg-white/5 rounded-xl w-16 h-16 border border-white/10 shrink-0 shadow-inner mt-1">
                                                <span className="text-xl font-extrabold text-primary-light leading-none">{new Date(appt.appointment_date).getDate()}</span>
                                                <span className="text-xs text-muted uppercase font-semibold mt-1">{new Date(appt.appointment_date).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white group-hover:text-primary transition-colors">{appt.doctor?.user?.full_name || 'Medical Consultation'}</p>
                                                <p className="text-sm text-primary font-medium mt-0.5">{appt.doctor?.specialization?.name || 'General'}</p>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                                    <p className="text-xs text-muted flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md"><Clock size={12} className="text-primary/70" /> {appt.start_time.slice(0,5)} - {appt.end_time.slice(0,5)}</p>
                                                    {appt.doctor?.clinic?.name && <p className="text-xs text-muted flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md"><MapPin size={12} className="text-secondary/70" /> {appt.doctor.clinic.name}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-0 pl-0 sm:pl-4 sm:border-l">
                                            <span className={`status-tag px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${appt.status === 'BOOKED' ? 'bg-primary/20 text-primary-light ring-primary/30' : appt.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 ring-red-500/30' : 'bg-white/10 text-muted ring-white/20'}`}>
                                                {appt.status}
                                            </span>
                                            <p className="text-xs font-mono text-muted mt-3 bg-black/20 px-2 py-1 rounded">Token: <span className="text-white">#{appt.token_number}</span></p>
                                            {appt.status === 'BOOKED' && (
                                                <button onClick={(e) => { e.stopPropagation(); handleCancel(appt.id); }} className="mt-3 text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-colors px-4 py-1.5 rounded-full font-bold shadow-lg shadow-red-500/10">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extended Details */}
                                    <div className="mt-2 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {appt.doctor?.user?.email && (
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <div className="bg-white/5 p-1.5 rounded-lg text-primary"><Mail size={14}/></div>
                                                <span className="truncate">{appt.doctor.user.email}</span>
                                            </div>
                                        )}
                                        {appt.doctor?.user?.phone && (
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <div className="bg-white/5 p-1.5 rounded-lg text-success"><Phone size={14}/></div>
                                                <span>{appt.doctor.user.phone}</span>
                                            </div>
                                        )}
                                        {appt.doctor?.consultation_fee !== undefined && (
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <div className="bg-white/5 p-1.5 rounded-lg text-orange-400"><DollarSign size={14}/></div>
                                                <span>Fees: <strong className="text-white">${appt.doctor.consultation_fee}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

const FindDoctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [bookingForm, setBookingForm] = useState({ date: new Date().toISOString().split('T')[0], start_time: '10:00', end_time: '10:30' });
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } catch (error) {
                toast.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Fetch doctor availability when date or selectedDoctor changes
    useEffect(() => {
        if (!selectedDoctor) return;
        const fetchSlots = async () => {
            setSlotsLoading(true);
            try {
                const res = await api.get(`/doctor-availability/${selectedDoctor.id}`);
                const allSlots = res.data;
                // Filter relevant slots for the selected date
                const dayOfWeek = new Date(bookingForm.date).toLocaleDateString('en-US', { weekday: 'long' });
                const dateSpecific = allSlots.filter((s: any) => s.date === bookingForm.date);
                const recurring = allSlots.filter((s: any) => !s.date && s.day_of_week?.toLowerCase() === dayOfWeek.toLowerCase());
                setAvailableSlots(dateSpecific.length > 0 ? dateSpecific : recurring);
            } catch (error) {
                setAvailableSlots([]);
            } finally {
                setSlotsLoading(false);
            }
        };
        fetchSlots();
    }, [selectedDoctor, bookingForm.date]);

    const filteredDoctors = doctors.filter(d =>
        d.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBook = async () => {
        try {
            await api.post('/appointments/book', {
                doctorId: selectedDoctor.id,
                appointment_date: bookingForm.date,
                start_time: bookingForm.start_time + ':00',
                end_time: bookingForm.end_time + ':00'
            });
            toast.success("Appointment booked successfully!");
            setSelectedDoctor(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Booking failed. Try different time slot.');
        }
    };

    const selectSlot = (slot: any) => {
        setBookingForm({
            ...bookingForm,
            start_time: slot.start_time?.slice(0, 5),
            end_time: slot.end_time?.slice(0, 5)
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="relative max-w-2xl group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors"><Search size={20} /></span>
                <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="pl-12 h-14 bg-white/[0.03] border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-white placeholder:text-muted/70 shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="card h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>) :
                    filteredDoctors.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                            <p className="text-muted text-lg">No doctors found matching your criteria.</p>
                        </div>
                    ) :
                        filteredDoctors.map((doc, i) => (
                            <motion.div
                                whileHover={{ y: -6, scale: 1.01 }}
                                key={i}
                                className="card flex flex-col gap-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all rounded-2xl relative overflow-hidden group shadow-lg"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex gap-4">
                                    <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-shadow">
                                        <Stethoscope className="text-primary-light" size={28} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-lg text-white truncate">{doc.user?.full_name}</h4>
                                        <p className="text-primary text-xs font-bold uppercase tracking-wider mt-0.5 truncate">{doc.specialization?.name || 'General Practitioner'}</p>
                                        <div className="flex items-center gap-1.5 text-yellow-500 mt-2 bg-yellow-500/10 w-fit px-2 py-0.5 rounded-full border border-yellow-500/20">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-bold text-yellow-500/90">4.8 <span className="text-muted font-normal">(120)</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider border-b border-white/10 my-0"></div>

                                <div className="flex flex-col gap-3 text-sm">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-muted flex items-center gap-2"><Clock size={16} className="text-primary/70" /> Experience</span>
                                        <span className="font-bold text-white">{doc.experience_years} Years</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-muted flex items-center gap-2"><MapPin size={16} className="text-secondary/70" /> Location</span>
                                        <span className="font-bold text-white truncate max-w-[140px] text-right">{doc.clinic?.name || 'Main Clinic'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-muted flex items-center gap-2"><DollarSign size={16} className="text-orange-400/70" /> Fee</span>
                                        <span className="font-bold text-white">${doc.consultation_fee}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedDoctor(doc)}
                                    className="btn btn-primary w-full mt-auto py-3 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow"
                                >
                                    Book Consultation
                                </button>
                            </motion.div>
                        ))
                }
            </div>

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0F131A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="text-primary" size={20} /> Book Appointment</h3>
                            <button onClick={() => setSelectedDoctor(null)} className="text-muted hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-5">
                            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center border border-primary/30">
                                <Stethoscope className="text-primary-light" size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-white">{selectedDoctor.user?.full_name}</p>
                                <p className="text-xs text-primary">{selectedDoctor.specialization?.name} • Fee: ${selectedDoctor.consultation_fee}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="form-group flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Select Date</label>
                                <input 
                                    type="date" 
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                    value={bookingForm.date}
                                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                                />
                            </div>

                            {/* Available Sessions */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Available Sessions</label>
                                {slotsLoading ? (
                                    <div className="h-16 bg-white/5 animate-pulse rounded-xl"></div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                                        <p className="text-red-400 text-xs font-bold">No availability for this date</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {availableSlots.map((slot, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => selectSlot(slot)}
                                                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                                    bookingForm.start_time === slot.start_time?.slice(0,5) && bookingForm.end_time === slot.end_time?.slice(0,5)
                                                        ? 'bg-primary/20 border-primary/50 ring-2 ring-primary/30'
                                                        : 'bg-white/5 border-white/10 hover:border-primary/30'
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-white">{slot.start_time?.slice(0,5)} - {slot.end_time?.slice(0,5)}</p>
                                                    <p className="text-xs text-muted mt-0.5">{slot.schedule_type} • Capacity: {slot.capacity} • {slot.interval_minutes}min intervals</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${slot.schedule_type === 'WAVE' ? 'bg-primary/20 text-primary-light border border-primary/20' : 'bg-secondary/20 text-secondary border border-secondary/20'}`}>
                                                    {slot.schedule_type}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">Start Time</label>
                                    <input 
                                        type="time" 
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                        value={bookingForm.start_time}
                                        onChange={(e) => setBookingForm({...bookingForm, start_time: e.target.value})}
                                    />
                                </div>
                                <div className="form-group flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-300">End Time</label>
                                    <input 
                                        type="time" 
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-primary/50 outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                        value={bookingForm.end_time}
                                        onChange={(e) => setBookingForm({...bookingForm, end_time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button onClick={handleBook} className="btn btn-primary w-full mt-2 py-3 shadow-lg shadow-primary/20">Confirm Booking</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const PatientSettings = () => {
    const { user } = useAuth();
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
                    <div className="mt-3 inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-muted">
                        Patient Account
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 relative z-10">
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Full Name</label>
                    <input value={user?.full_name} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label className="text-sm font-bold pl-1 text-gray-300">Email Address</label>
                    <input value={user?.email} readOnly className="border-white/10 bg-black/20 text-white cursor-not-allowed focus:ring-0 opacity-70" />
                </div>
            </div>

            <button className="btn btn-primary py-3.5 shadow-lg shadow-primary/20 relative z-10 mt-2" onClick={() => toast.success("Profile update pending")}>
                Save Changes
            </button>
        </div>
    )
}

const PatientDashboard = () => {
    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/patient' },
        { icon: <Search size={20} />, label: 'Find Doctors', path: '/patient/doctors' },
        { icon: <History size={20} />, label: 'My Appointments', path: '/patient/appointments' },
        { icon: <User size={20} />, label: 'Profile Settings', path: '/patient/profile' },
    ];

    return (
        <DashboardLayout items={sidebarItems}>
            <Routes>
                <Route index element={<Overview />} />
                <Route path="doctors" element={<FindDoctors />} />
                <Route path="appointments" element={<Overview />} /> {/* Reuse for now */}
                <Route path="profile" element={<PatientSettings />} />
                <Route path="*" element={<Navigate to="" />} />
            </Routes>
        </DashboardLayout>
    );
};

export default PatientDashboard;
