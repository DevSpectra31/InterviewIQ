import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  BarChart3,
  BookOpen,
  ShieldCheck,
  Play,
  User,
  ArrowRight,
  Eye,
  Award,
  Clock,
  Cpu,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import interviewService from '../services/interviewService.js';
import analyticsService from '../services/analyticsService.js';
import InterviewReviewModal from '../components/InterviewReviewModal.jsx';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [analytics, setAnalytics] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [anaRes, intRes] = await Promise.all([
        analyticsService.getUserAnalytics().catch(() => ({ data: null })),
        interviewService.getInterviews({ page: 1, limit: 5 }).catch(() => ({ data: [] })),
      ]);

      if (anaRes?.data) setAnalytics(anaRes.data);
      if (intRes?.data) setRecentInterviews(intRes.data);
    } catch (err) {
      console.warn('Dashboard fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = async (id) => {
    try {
      const res = await interviewService.getInterviewById(id);
      if (res.success && res.data) {
        setSelectedInterview(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    {
      label: 'Completed Interviews',
      value: analytics?.completedInterviews ?? (user?.interviewCount || 0),
      change: 'Total practice sessions',
      icon: History,
      color: 'text-violet-400',
    },
    {
      label: 'Average Score',
      value: analytics?.averageScore !== undefined && analytics?.averageScore !== null ? `${analytics.averageScore}/10` : '—',
      change: 'Calculated across sessions',
      icon: BarChart3,
      color: 'text-emerald-400',
    },
    {
      label: 'Experience Level',
      value: user?.experience
        ? user.experience.charAt(0) + user.experience.slice(1).toLowerCase()
        : 'Fresher',
      change: 'Profile classification',
      icon: ShieldCheck,
      color: 'text-blue-400',
    },
    {
      label: 'Questions Evaluated',
      value: analytics?.totalQuestionsAnswered ?? 0,
      change: 'AI scored answers',
      icon: BookOpen,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-10">
      {selectedInterview && (
        <InterviewReviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}

      {/* ─── Welcome Hero ──────────────────────────────────────────── */}
      <motion.section
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12 shadow-2xl"
        {...fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 inline-flex items-center gap-1.5">
            Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4 leading-tight">
            Master Your Next Interview with{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewIQ
            </span>
          </h1>
          <p className="text-base text-slate-400 mb-8 leading-relaxed max-w-2xl">
            Conduct adaptive mock interviews powered by AI. Experience real-time assessment, detailed question scoring, and performance analytics tailored to your dream role.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/interviews')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              Start New Mock Interview
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 hover:border-slate-600 active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              <User className="w-4 h-4 mr-2" />
              Manage Skills & Profile
            </button>
          </div>
        </div>
      </motion.section>

      {/* ─── Quick Stats ───────────────────────────────────────────── */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between backdrop-blur-sm hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1.5 min-w-0 flex-1 mr-4">
              <span className="text-xs text-slate-400 block">{stat.label}</span>
              <span className="text-2xl font-black text-white block">
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {stat.change}
              </span>
            </div>
            <div
              className={`flex-shrink-0 p-3 rounded-xl bg-slate-800/50 border border-slate-800 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </motion.section>

      {/* ─── Content Grid ──────────────────────────────────────────── */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Recent Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <History className="w-5 h-5 mr-2 text-violet-400" />
                Recent Practice Sessions
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentInterviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Cpu className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-400 text-sm mb-1 font-medium">
                    No sessions recorded yet
                  </p>
                  <p className="text-slate-500 text-xs text-center">
                    Launch a mock session to build your interview practice history.
                  </p>
                </div>
              ) : (
                recentInterviews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.topic}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.duration ? `${item.duration}m` : 'N/A'}
                        </span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.overallScore !== null && (
                        <div className="text-right">
                          <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> {item.overallScore}/10
                          </span>
                        </div>
                      )}
                      {item.status === 'COMPLETED' ? (
                        <button
                          onClick={() => handleOpenReview(item.id)}
                          className="p-2 rounded-lg bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 border border-violet-500/20 text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/interviews/${item.id}`)}
                          className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold"
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Practice Quick Launcher */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-2 flex items-center">
              <Play className="w-5 h-5 mr-2 text-indigo-400" />
              Quick Interview Launcher
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Launch a mock interview session customized to your target skills.
            </p>

            <div className="space-y-3">
              {['React.js & Frontend', 'Node.js & Backend Architecture', 'System Design & Scalability', 'HR & Behavioural Scenarios'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => navigate('/interviews')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-medium hover:bg-violet-600/10 hover:border-violet-500/40 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{topic}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}

              <button
                onClick={() => navigate('/interviews')}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/10 transition-all mt-4 cursor-pointer"
              >
                Custom Practice Session
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
