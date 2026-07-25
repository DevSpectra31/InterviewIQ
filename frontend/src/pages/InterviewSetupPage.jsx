import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Code2, Users, FileText, Building2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import interviewService from '../services/interviewService.js';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

const INTERVIEW_TYPES = [
  {
    id: 'TECHNICAL',
    title: 'Technical & Coding',
    desc: 'Deep-dive technical questions, framework concepts, algorithm design, and system architecture.',
    icon: Code2,
    color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
  },
  {
    id: 'HR',
    title: 'HR & Behavioural',
    desc: 'STAR framework behavioural scenarios, team collaboration, conflict resolution, and career goals.',
    icon: Users,
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
  },
  {
    id: 'RESUME',
    title: 'Resume & Portfolio',
    desc: 'Questions tailored around your featured projects, individual contributions, and technical choices.',
    icon: FileText,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'COMPANY',
    title: 'Company Specific',
    desc: 'Targeted mock interviews simulating culture, values, and leadership principles of top tech companies.',
    icon: Building2,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  },
];

const POPULAR_TOPICS = [
  'React.js',
  'Node.js',
  'System Design',
  'JavaScript',
  'Python',
  'Data Structures & Algorithms',
  'SQL & Database Design',
  'Behavioral Scenarios',
];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('TECHNICAL');
  const [topic, setTopic] = useState('React.js');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setToast({ type: 'error', message: 'Please specify a target topic or technology' });
      return;
    }

    try {
      setLoading(true);
      const res = await interviewService.createInterview({ type, topic: topic.trim(), difficulty });
      if (res.success && res.data) {
        navigate(`/interviews/${res.data.id}`);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to initialize interview session' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" /> AI Mock Interview Generator
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Configure Your Session</h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Tailor your mock interview parameters. Our AI interviewer will generate dynamic adaptive questions with real-time feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Interview Type */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-300 uppercase tracking-wider block">
            1. Select Interview Focus
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTERVIEW_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = type === item.id;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setType(item.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden bg-gradient-to-br ${
                    isSelected
                      ? `${item.color} shadow-lg shadow-violet-500/5`
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-violet-400" />}
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Topic */}
        <div className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <label className="text-sm font-bold text-slate-300 uppercase tracking-wider block">
            2. Topic or Target Role
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. React.js, System Design, Fullstack Developer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm transition-all"
            required
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-500 py-1">Popular Topics:</span>
            {POPULAR_TOPICS.map((top) => (
              <button
                key={top}
                type="button"
                onClick={() => setTopic(top)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  topic === top
                    ? 'bg-violet-600 text-white border-violet-500'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {top}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Difficulty Level */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-300 uppercase tracking-wider block">
            3. Target Difficulty
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'EASY', label: 'Easy', desc: 'Core fundamentals & definitions' },
              { id: 'MEDIUM', label: 'Medium', desc: 'Standard industry interview standard' },
              { id: 'HARD', label: 'Hard', desc: 'Complex edge cases & architecture' },
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  difficulty === diff.id
                    ? 'bg-violet-600/15 border-violet-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-white mb-1">{diff.label}</div>
                <div className="text-[11px] text-slate-400">{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <Button
            type="submit"
            isLoading={loading}
            className="w-full sm:w-auto px-10 py-4 text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl shadow-xl shadow-violet-600/20 inline-flex items-center justify-center gap-2"
          >
            Start Interview Session <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
