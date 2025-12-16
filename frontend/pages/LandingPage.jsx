import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, ShieldCheck, GraduationCap, ArrowRight, ChevronDown, ChevronUp, Sparkles, Bell } from 'lucide-react';
import { announcementAPI } from '../services/api';

const LandingPage = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    React.useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await announcementAPI.getAll();
                setAnnouncements(data.slice(0, 3)); // Show top 3
            } catch (error) {
                console.error("Failed to fetch public announcements", error);
            } finally {
                setLoadingAnnouncements(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            q: "How do I register for an event?",
            a: "Simply log in to the Student Portal, browse the events on your dashboard or events page, and click the 'Register' button on the event card. You'll receive an instant confirmation."
        },
        {
            q: "Who can access the Admin Portal?",
            a: "The Admin Portal is restricted to authorized university faculty and student council members. If you require administrative access, please contact the IT support department."
        },
        {
            q: "Is UniEvent Pro free for students?",
            a: "Yes! The platform is completely free for all currently enrolled students to use for finding and registering for campus events."
        },
        {
            q: "Can I cancel my registration?",
            a: "Absolutely. Go to 'My Registrations', find the event you can no longer attend, and click cancel. This helps free up spots for other students."
        }
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">

            {/* Custom Animations for Background */}
            <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Primary Gradient Blob */}
                    <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl animate-blob mix-blend-multiply dark:mix-blend-normal" />

                    {/* Secondary Gradient Blob */}
                    <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-cyan-200/40 to-blue-200/40 dark:from-cyan-900/20 dark:to-blue-900/20 blur-3xl animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-normal" />

                    {/* Tertiary Gradient Blob (New) */}
                    <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-purple-200/40 to-pink-200/40 dark:from-purple-900/20 dark:to-pink-900/20 blur-3xl animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-normal" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                        {/* Left Content */}
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 border border-indigo-100 dark:border-indigo-800 shadow-sm animate-fade-in-up">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                Campus Event Management Reimagined
                            </div>

                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
                                <span className="block xl:inline">Seamless Event</span>{' '}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 xl:inline">Experience</span>
                            </h1>

                            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                                UniEvent Pro connects students with campus life. Discover workshops, join clubs, and manage your extracurricular journey with a modern, intuitive platform designed for university success.
                            </p>

                            <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                                <div className="rounded-md shadow-lg shadow-indigo-500/20">
                                    <Link
                                        to="/login/student"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 md:py-4 md:text-lg transition-all hover:-translate-y-1"
                                    >
                                        Student Portal
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        to="/register"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 md:py-4 md:text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                                    >
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute inset-0 bg-indigo-900/10 dark:bg-indigo-900/30 mix-blend-multiply z-10"></div>
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                    alt="University students collaborating"
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3 z-20 animate-bounce-slow hidden sm:flex">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">500+ Events</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Hosted this semester</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:text-center mb-16">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Why Choose UniEvent Pro?</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Tools tailored for campus life
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            We provide a complete ecosystem for administrators to organize and students to participate.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    name: 'Easy Registration',
                                    description: 'One-click event sign-ups with instant confirmation handling.',
                                    icon: Users,
                                    color: 'bg-blue-500',
                                },
                                {
                                    name: 'Live Updates',
                                    description: 'Real-time notifications for schedule changes and important announcements.',
                                    icon: Calendar,
                                    color: 'bg-indigo-500',
                                },
                                {
                                    name: 'Smart Analytics',
                                    description: 'Detailed insights on student engagement and event popularity.',
                                    icon: BarChart3,
                                    color: 'bg-purple-500',
                                },
                                {
                                    name: 'Secure Platform',
                                    description: 'Role-based access ensuring data privacy and integrity.',
                                    icon: ShieldCheck,
                                    color: 'bg-teal-500',
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="relative group p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.color} text-white shadow-lg mb-6 transform group-hover:rotate-6 transition-transform`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feature.name}</h3>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Announcements Section */}
            <section className="py-24 bg-indigo-50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Latest Announcements</h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Stay updated with campus news</p>
                    </div>

                    {loadingAnnouncements ? (
                        <div className="text-center text-gray-500">Loading updates...</div>
                    ) : announcements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map((announcement) => (
                                <div key={announcement.id || announcement._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center mb-4">
                                        <Bell className="w-5 h-5 text-indigo-500 mr-2" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                            {new Date(announcement.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{announcement.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                        {announcement.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No recent announcements.</p>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Everything you need to know about the platform.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`bg-white dark:bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 ${openFaqIndex === idx
                                    ? 'border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500'
                                    : 'border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                                >
                                    <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.q}</span>
                                    {openFaqIndex === idx ? (
                                        <ChevronUp className="w-5 h-5 text-indigo-500 flex-shrink-0 ml-4" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-800 pt-4">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="relative max-w-2xl mx-auto text-center z-10">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Join thousands of students and manage your campus life with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1">
                            Create Free Account
                        </Link>
                        <Link to="/login/student" className="px-8 py-4 rounded-xl border-2 border-indigo-300 text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-1">
                            Student Login
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
