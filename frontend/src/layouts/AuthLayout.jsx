import { Outlet } from 'react-router-dom';
import { Cpu, ShieldCheck, Mic, BarChart3 } from 'lucide-react';

/**
 * Auth layout — split-screen design for login/register pages.
 * Left: brand panel with features list | Right: auth form (Outlet)
 */
export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* ─── Brand Panel (visible on lg+) ──────────────────────────── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <Cpu size={32} className="text-violet-300" />
          </div>

          <h2 className="auth-brand-title">InterviewIQ</h2>
          <p className="auth-brand-subtitle">
            Ace your next interview with AI-powered mock sessions, detailed scoring, and personalized study plans.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <Mic size={16} />
              </div>
              <span className="auth-brand-feature-text">
                Adaptive mock interviews tailored to your role
              </span>
            </div>
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <BarChart3 size={16} />
              </div>
              <span className="auth-brand-feature-text">
                Detailed scoring and performance analytics
              </span>
            </div>
            <div className="auth-brand-feature">
              <div className="auth-brand-feature-icon">
                <ShieldCheck size={16} />
              </div>
              <span className="auth-brand-feature-text">
                AI-generated feedback with improvement areas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Form Panel ────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
