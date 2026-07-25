import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Lightbulb, Award, BookOpen, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewReviewModal({ interview, onClose }) {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  if (!interview) return null;

  const questions = interview.questions || [];
  const currentQ = questions[activeQuestionIdx];

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'bg-slate-700 text-slate-300';
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (score >= 5) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* ── Modal Header ── */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-white">{interview.topic}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {interview.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  {interview.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {interview.duration ? `${interview.duration} mins` : 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {questions.length} questions asked
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              {interview.overallScore !== null && (
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Score</p>
                  <p className="text-2xl font-black text-violet-400">{interview.overallScore}/10</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Modal Body ── */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left sidebar: Question Selector */}
            <div className="w-full md:w-72 border-r border-slate-800 bg-slate-900/40 p-3 overflow-y-auto space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase px-3 py-1">Questions</p>
              {questions.length === 0 ? (
                <p className="text-xs text-slate-500 px-3">No questions recorded in this session.</p>
              ) : (
                questions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 border ${
                      activeQuestionIdx === idx
                        ? 'bg-violet-600/10 border-violet-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold mb-1">Q{idx + 1}</p>
                      <p className="text-xs text-slate-400 truncate">{q.questionText}</p>
                    </div>
                    {q.score !== null && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreColor(q.score)}`}>
                        {q.score}/10
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Right panel: Active Question Breakdown */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
              {currentQ ? (
                <>
                  {/* Question Title & Score Banner */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 text-xs font-bold">
                        Question {activeQuestionIdx + 1}
                      </span>
                      {currentQ.score !== null && (
                        <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 ${getScoreColor(currentQ.score)}`}>
                          <Award className="w-4 h-4" /> Score: {currentQ.score} / 10
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white leading-relaxed">{currentQ.questionText}</h3>
                  </div>

                  {/* Candidate Answer */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Response</h4>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {currentQ.answerText || <span className="italic text-slate-500">No answer recorded for this question.</span>}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Key Strengths
                      </h4>
                      {currentQ.strengths && currentQ.strengths.length > 0 ? (
                        <ul className="space-y-1.5">
                          {currentQ.strengths.map((str, i) => (
                            <li key={i} className="text-xs text-emerald-200/90 flex items-start gap-2">
                              <span className="text-emerald-400">•</span> {str}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">None highlighted.</p>
                      )}
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" /> Areas for Improvement
                      </h4>
                      {currentQ.weaknesses && currentQ.weaknesses.length > 0 ? (
                        <ul className="space-y-1.5">
                          {currentQ.weaknesses.map((w, i) => (
                            <li key={i} className="text-xs text-amber-200/90 flex items-start gap-2">
                              <span className="text-amber-400">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">None highlighted.</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Concepts */}
                  {currentQ.missingConcepts && currentQ.missingConcepts.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Tag className="w-4 h-4 text-violet-400" /> Key Missing Concepts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentQ.missingConcepts.map((concept, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ideal Answer */}
                  {currentQ.idealAnswer && (
                    <div className="bg-slate-900 border border-violet-500/30 rounded-xl p-5 space-y-2">
                      <h4 className="text-xs font-bold text-violet-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" /> Recommended Ideal Response
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {currentQ.idealAnswer}
                      </p>
                    </div>
                  )}

                  {/* Suggestions */}
                  {currentQ.suggestions && currentQ.suggestions.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                      <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4" /> Actionable Tips
                      </h4>
                      <ul className="space-y-1.5">
                        {currentQ.suggestions.map((sug, i) => (
                          <li key={i} className="text-xs text-sky-200 flex items-start gap-2">
                            <span className="text-sky-400">➔</span> {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Select a question from the left sidebar to view evaluation breakdown.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
