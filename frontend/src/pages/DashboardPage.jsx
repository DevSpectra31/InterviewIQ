import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  BarChart3,
  BookOpen,
  ShieldCheck,
  Play,
  Upload,
  Mic,
  Cpu,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const stats = [
    {
      label: 'Completed Interviews',
      value: user?.interviewCount || 0,
      change: 'Total practice sessions',
      icon: History,
      color: 'text-violet-400',
    },
    {
      label: 'Average Score',
      value: '—',
      change: 'Complete interviews to see',
      icon: BarChart3,
      color: 'text-emerald-400',
    },
    {
      label: 'Experience Level',
      value: user?.experience
        ? user.experience.charAt(0) + user.experience.slice(1).toLowerCase()
        : 'Fresher',
      change: 'Current profile setting',
      icon: ShieldCheck,
      color: 'text-blue-400',
    },
    {
      label: 'Study Plans Active',
      value: '0 Plans',
      change: 'Coming soon',
      icon: BookOpen,
      color: 'text-amber-400',
    },
  ];

  return (
    <div>
      {/* ─── Welcome Hero ──────────────────────────────────────────── */}
      <motion.section
        className="mb-14 relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-10 sm:p-14 shadow-2xl"
        {...fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-6 leading-tight">
            Master Your Next Interview with{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              InterviewIQ
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Conduct interactive, adaptive mock interviews with our AI system. Get
            professional scores, detailed insights, and direct study guides to
            clear your dream role.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/interviews')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Start a Mock Interview
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 hover:border-slate-600 active:scale-[0.98] transition-all cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </button>
          </div>
        </div>
      </motion.section>

      {/* ─── Quick Stats ───────────────────────────────────────────── */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between backdrop-blur-sm hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1.5 min-w-0 flex-1 mr-4">
              <span className="text-sm text-slate-400 block">{stat.label}</span>
              <span className="text-3xl font-bold text-white block">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 block">
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
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <History className="w-5 h-5 mr-2 text-violet-400" />
              Recent Interview Practice Sessions
            </h3>
            <div className="divide-y divide-slate-800/60 space-y-4">
              {user?.interviewCount > 0 ? (
                <p className="text-sm text-slate-400 py-4">
                  Your recent sessions will appear here. Start an interview to
                  see your progress.
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Cpu className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-400 text-sm mb-1 font-medium">
                    No sessions yet
                  </p>
                  <p className="text-slate-500 text-xs text-center">
                    Start your first mock interview to begin tracking your
                    progress.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Setup Panel */}
        <div className="space-y-8">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-indigo-400" />
              Quick Interview
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Set your parameters and launch a mock session instantly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Role Target
                </label>
                <select className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                  <option>Software Engineer</option>
                  <option>Full-Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>System Architect</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Difficulty
                </label>
                <select className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                  <option>Entry Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500 text-violet-400 text-xs font-semibold text-center cursor-pointer">
                    Technical
                  </button>
                  <button className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold text-center hover:border-slate-600 cursor-pointer">
                    Behavioral
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate('/interviews')}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/10 active:scale-[0.98] transition-all mt-4 cursor-pointer"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
