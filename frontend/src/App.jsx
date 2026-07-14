import { useState } from 'react';
import { 
  User, 
  Settings, 
  History, 
  BarChart3, 
  BookOpen, 
  Upload, 
  Play, 
  ChevronRight, 
  ShieldCheck, 
  Mic, 
  Cpu
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-white bg-clip-text text-transparent">
                InterviewIQ
              </span>
              <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
                AI Powered
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('interviews')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'interviews' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              Start Interview
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              History
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">Candidate</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <section className="mb-12 relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Welcome back
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 mb-6 leading-tight">
              Master Your Next Interview with <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">InterviewIQ</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Conduct interactive, adaptive mock interviews with our AI system. Get professional scores, detailed insights, and direct study guides to clear your dream role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setActiveTab('interviews')}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Start a Mock Interview
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 hover:border-slate-600 active:scale-98 transition-all">
                <Upload className="w-5 h-5 mr-2" />
                Upload Resume
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Completed Interviews', value: '12', change: '+2 this week', icon: History, color: 'text-violet-400' },
            { label: 'Average Score', value: '78%', change: '+5% improvement', icon: BarChart3, color: 'text-emerald-400' },
            { label: 'Strongest Topic', value: 'System Design', change: '92% competence', icon: ShieldCheck, color: 'text-blue-400' },
            { label: 'Study Plans Active', value: '1 Plan', change: '3 topics remaining', icon: BookOpen, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex items-start justify-between backdrop-blur-sm hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <span className="text-sm text-slate-400 block">{stat.label}</span>
                <span className="text-3xl font-bold text-white block">{stat.value}</span>
                <span className="text-xs text-slate-500 block">{stat.change}</span>
              </div>
              <div className={`p-3 rounded-xl bg-slate-850 border border-slate-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </section>

        {/* Dynamic Section Content */}
        {activeTab === 'dashboard' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Recent Activity & Action Cards */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <History className="w-5 h-5 mr-2 text-violet-400" />
                  Recent Interview Practice Sessions
                </h3>
                <div className="divide-y divide-slate-800/60 space-y-4">
                  {[
                    { role: 'Senior Frontend Engineer (React/TypeScript)', date: 'Yesterday', score: '82%', type: 'Technical' },
                    { role: 'System Design Architect', date: '3 days ago', score: '74%', type: 'System Design' },
                    { role: 'Behavioral & Leadership', date: '1 week ago', score: '79%', type: 'HR' }
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between pt-4 first:pt-0">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm hover:text-violet-400 transition-colors cursor-pointer">{session.role}</h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <span>{session.type}</span>
                          <span>•</span>
                          <span>{session.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-sm font-semibold text-white block">{session.score}</span>
                          <span className="text-2xs text-emerald-400">Passed</span>
                        </div>
                        <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Quick Setup Panel */}
            <div className="space-y-8">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-indigo-400" />
                  Quick Interview
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Set your parameters and launch a mock session instantly.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">Role Target</label>
                    <select className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                      <option>Software Engineer</option>
                      <option>Full-Stack Developer</option>
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>System Architect</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">Difficulty</label>
                    <select className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500">
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">Interview Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500 text-violet-400 text-xs font-semibold text-center">
                        Technical
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-400 text-xs font-semibold text-center hover:border-slate-600">
                        Behavioral
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('interviews')}
                    className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/10 active:scale-98 transition-all mt-4 cursor-pointer"
                  >
                    Start Session
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab !== 'dashboard' && (
          <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center">
            <Cpu className="w-12 h-12 text-violet-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              This module is prepared as part of the InterviewIQ folder structure. In the next steps, we will implement full features here.
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-6 px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-all"
            >
              Back to Dashboard
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 InterviewIQ Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
