import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import analyticsService from '../services/analyticsService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getUserAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error fetching performance analytics' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-400">Loading performance analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-violet-400" /> Performance Analytics & Insights
        </h1>
        <p className="text-sm text-slate-400">
          Comprehensive quantitative overview of your interview progress, domain mastery, and score trends.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-400">{data.averageScore}</span>
            <span className="text-xs text-slate-500">/ 10</span>
          </div>
          <p className="text-xs text-slate-500">Across all completed sessions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mock Sessions</p>
          <span className="text-3xl font-black text-white">{data.totalInterviews}</span>
          <p className="text-xs text-slate-500">{data.completedInterviews} completed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions Evaluated</p>
          <span className="text-3xl font-black text-sky-400">{data.totalQuestionsAnswered}</span>
          <p className="text-xs text-slate-500">Answered & scored by AI</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
          <span className="text-3xl font-black text-emerald-400">
            {data.totalInterviews > 0
              ? `${Math.round((data.completedInterviews / data.totalInterviews) * 100)}%`
              : '0%'}
          </span>
          <p className="text-xs text-slate-500">Session completion ratio</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progression Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" /> Score Progression Over Time
            </h3>
          </div>
          {data.scoreTrend.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              Complete mock interviews to view your score trend graph.
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Performance by Interview Type Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" /> Average Score by Interview Focus
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.typeBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & Skill Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-amber-400" /> Difficulty Distribution
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.difficultyBreakdown}
                  dataKey="count"
                  nameKey="difficulty"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                >
                  {data.difficultyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {data.difficultyBreakdown.map((item, idx) => (
              <div key={item.difficulty} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.difficulty}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-emerald-400 text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Top Highlighted Strengths
          </h3>
          {data.topStrengths.length === 0 ? (
            <p className="text-xs text-slate-500 py-8">Complete sessions to surface key recurring strengths.</p>
          ) : (
            <div className="space-y-2 pt-2">
              {data.topStrengths.map((str, idx) => (
                <div key={idx} className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-200 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Areas to Practice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-amber-400 text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Recommended Practice Areas
          </h3>
          {data.topWeaknesses.length === 0 ? (
            <p className="text-xs text-slate-500 py-8">No targeted weakness patterns identified yet.</p>
          ) : (
            <div className="space-y-2 pt-2">
              {data.topWeaknesses.map((w, idx) => (
                <div key={idx} className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
