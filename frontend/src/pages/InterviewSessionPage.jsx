import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Clock,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Sparkles,
  Check,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import interviewService from '../services/interviewService.js';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import InterviewReviewModal from '../components/InterviewReviewModal.jsx';

export default function InterviewSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [toast, setToast] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef(null);

  // Fetch interview data on mount
  useEffect(() => {
    fetchSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Timer tick
  useEffect(() => {
    if (interview && interview.status === 'IN_PROGRESS' && !isFinished) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interview, isFinished]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getInterviewById(id);
      if (res.success && res.data) {
        const session = res.data;
        setInterview(session);

        if (session.status === 'COMPLETED') {
          setIsFinished(true);
          return;
        }

        // Auto-start if PENDING
        if (session.status === 'PENDING') {
          await interviewService.startInterview(id);
        }

        // Check if there is an active unanswered question
        const questions = session.questions || [];
        const unanswered = questions.find((q) => q.answerText === '' || q.score === null);

        if (unanswered) {
          setCurrentQuestion(unanswered);
        } else {
          // Generate first / next question
          await fetchNextQuestion();
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error loading interview session' });
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      setIsSubmitting(true);
      setEvaluation(null);
      setAnswerText('');

      const res = await interviewService.getNextQuestion(id);
      if (res.success && res.data) {
        setCurrentQuestion(res.data);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Error fetching question' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !currentQuestion) {
      setToast({ type: 'error', message: 'Please type an answer before submitting' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await interviewService.submitAnswer(id, currentQuestion.id, answerText);
      if (res.success && res.data) {
        setEvaluation(res.data);
        // Refresh local interview state questions
        setInterview((prev) => ({
          ...prev,
          questions: [...(prev.questions || []).filter((q) => q.id !== currentQuestion.id), res.data],
        }));
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to submit answer' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      setLoading(true);
      const res = await interviewService.completeInterview(id);
      if (res.success && res.data) {
        setInterview(res.data);
        setIsFinished(true);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to complete interview' });
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (loading && !interview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-400">Initializing AI Mock Interview workspace...</p>
      </div>
    );
  }

  if (!interview) return null;

  const questionList = interview.questions || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {showReviewModal && (
        <InterviewReviewModal interview={interview} onClose={() => setShowReviewModal(false)} />
      )}

      {/* Header bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{interview.topic}</h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {interview.type}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                {interview.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Session • {questionList.length} Questions Asked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-mono font-bold text-white">{formatTimer(secondsElapsed)}</span>
          </div>

          <Button
            onClick={handleFinishInterview}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-rose-600/20 hover:border-rose-500/30 text-rose-400 border border-slate-700 rounded-xl"
          >
            Finish Interview
          </Button>
        </div>
      </div>

      {/* Completion View */}
      {isFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Interview Session Completed!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Great job! Your answers have been evaluated and scored by our AI assessment engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto py-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase">Overall Score</p>
              <p className="text-3xl font-black text-violet-400 mt-1">
                {interview.overallScore !== null ? `${interview.overallScore}/10` : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase">Questions Answered</p>
              <p className="text-3xl font-black text-white mt-1">{questionList.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase">Duration</p>
              <p className="text-3xl font-black text-sky-400 mt-1">
                {interview.duration ? `${interview.duration} mins` : formatTimer(secondsElapsed)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => setShowReviewModal(true)}
              className="px-6 py-3 font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Review Full Q&A Feedback
            </Button>
            <Button
              onClick={() => navigate('/analytics')}
              className="px-6 py-3 font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl"
            >
              View Analytics Dashboard
            </Button>
            <Button
              onClick={() => navigate('/interviews')}
              className="px-6 py-3 font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Start Another Session
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Active Interview Question & Evaluation Interface */
        <div className="space-y-6">
          {/* Active Question Card */}
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 relative shadow-xl"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold uppercase tracking-wider">
                    Question {questionList.length || 1}
                  </span>
                  {currentQuestion.isFollowUp && (
                    <span className="text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded font-medium">
                      Adaptive Follow-Up
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Evaluation Result Card (if evaluated) */}
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-violet-500/30 rounded-2xl p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-lg">
                  <Award className="w-6 h-6" /> AI Evaluation Results
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 font-black text-lg border border-violet-500/40">
                  {evaluation.score} / 10
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> Key Strengths
                  </h4>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="text-xs text-emerald-200 flex items-start gap-1.5">
                        <span>•</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" /> Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {evaluation.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-amber-200 flex items-start gap-1.5">
                        <span>•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ideal Answer */}
              {evaluation.idealAnswer && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">Ideal Response</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {evaluation.idealAnswer}
                  </p>
                </div>
              )}

              {/* Next Question button */}
              <div className="pt-2 flex justify-end">
                <Button
                  onClick={fetchNextQuestion}
                  isLoading={isSubmitting}
                  className="px-6 py-3 font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center gap-2"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Answer Input Form (shown if answer not yet evaluated) */}
          {!evaluation && (
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Your Response
                  </label>
                  <span>{answerText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>

                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your structured answer here. Be detailed and mention relevant concepts, code snippets, or real-world examples..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm leading-relaxed transition-all"
                  disabled={isSubmitting}
                />

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-500">
                    Press Submit to evaluate answer with AI.
                  </p>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="px-6 py-2.5 font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl inline-flex items-center gap-2 text-sm shadow-lg shadow-violet-600/20"
                  >
                    Submit Answer <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
