import { useState } from 'react';
import { User, Mail, Briefcase, Award, Plus, X, Save, Check } from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import { updateProfile } from '../services/authService.js';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

const EXPERIENCE_OPTIONS = [
  { value: 'FRESHER', label: 'Fresher / Entry Level' },
  { value: 'JUNIOR', label: 'Junior (1-2 years)' },
  { value: 'MID', label: 'Mid-Level (3-5 years)' },
  { value: 'SENIOR', label: 'Senior (5-8 years)' },
  { value: 'LEAD', label: 'Tech Lead / Principal' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [experience, setExperience] = useState(user?.experience || 'FRESHER');
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile({
        name,
        bio,
        experience,
        skills,
      });

      if (res.data) {
        updateUser(res.data);
        setToast({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-violet-600/20 shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">{user?.name}</h1>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" /> {user?.email}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {user?.role || 'USER'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              {user?.experience || 'FRESHER'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
          Personal Information & Career Skills
        </h2>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
            required
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Professional Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Brief introduction about your technical background and career goals..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-violet-500 transition-all leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-500">{bio.length}/500</div>
        </div>

        {/* Skills Tag Editor */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Technical Skills & Technologies
          </label>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. React.js, Node.js, PostgreSQL..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.length === 0 ? (
              <p className="text-xs text-slate-500">No skills added yet.</p>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            isLoading={loading}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-violet-600/20"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
