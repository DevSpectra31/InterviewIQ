import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  Trash2,
  Play,
  Eye,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import interviewService from '../services/interviewService.js';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import InterviewReviewModal from '../components/InterviewReviewModal.jsx';

export default function HistoryPage() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected interview for review modal
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInterviews(1);
  }, [typeFilter, statusFilter]);

  const fetchInterviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await interviewService.getInterviews({
        page,
        limit: 10,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });

      if (res.success) {
        setInterviews(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error loading interview history' });
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
      setToast({ type: 'error', message: err.message || 'Failed to load details' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete or cancel this interview record?')) return;

    try {
      const res = await interviewService.deleteInterview(id);
      if (res.success) {
        setToast({ type: 'success', message: 'Interview record removed' });
        fetchInterviews(pagination.page);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete interview' });
    }
  };

  // Local search filter
  const filteredInterviews = interviews.filter((item) =>
    item.topic.toLowerCase().includes(search.toLowerCase().trim())
  );

  const getScoreBadge = (score) => {
    if (score === null || score === undefined)
      return <span className="text-slate-500 text-xs italic">Unrated</span>;
    if (score >= 8)
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{score}/10</span>;
    if (score >= 5)
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">{score}/10</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">{score}/10</span>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">In Progress</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">Pending</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {selectedInterview && (
        <InterviewReviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Interview History</h1>
          <p className="text-sm text-slate-400">
            Track past mock interview performance, scores, and AI evaluations.
          </p>
        </div>

        <Button
          onClick={() => navigate('/interviews')}
          className="px-5 py-2.5 font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" /> Start New Session
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews by topic or tech stack..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden md:block" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="">All Focus Types</option>
            <option value="TECHNICAL">Technical</option>
            <option value="HR">HR & Behavioural</option>
            <option value="RESUME">Resume</option>
            <option value="COMPANY">Company Specific</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Interview List / Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No interviews found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven&apos;t conducted any mock interviews matching your selected criteria yet.
          </p>
          <Button
            onClick={() => navigate('/interviews')}
            className="mt-2 px-5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl"
          >
            Create Mock Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{item.topic}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {item.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {item.difficulty}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.duration ? `${item.duration} mins` : 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {item._count?.questions || 0} questions
                  </span>
                </div>
              </div>

              {/* Score & Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-500" />
                  {getScoreBadge(item.overallScore)}
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'COMPLETED' ? (
                    <Button
                      onClick={() => handleOpenReview(item.id)}
                      className="px-3.5 py-1.5 text-xs font-bold bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/interviews/${item.id}`)}
                      className="px-3.5 py-1.5 text-xs font-bold bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 border border-amber-500/30 rounded-xl flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Continue
                    </Button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete Interview Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total sessions)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchInterviews(pagination.page - 1)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchInterviews(pagination.page + 1)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
