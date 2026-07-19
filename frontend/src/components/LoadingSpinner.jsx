import { Cpu } from 'lucide-react';

/**
 * Loading spinner — full-page overlay or inline variant.
 *
 * @param {object} props
 * @param {boolean} [props.fullPage=true] - Full-screen overlay vs. inline
 * @param {string} [props.text] - Optional loading text
 */
export default function LoadingSpinner({ fullPage = true, text = 'Loading...' }) {
  if (!fullPage) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <span className="spinner-inline text-violet-400" />
        {text && <span className="text-sm text-slate-400">{text}</span>}
      </div>
    );
  }

  return (
    <div className="spinner-overlay">
      <div className="relative">
        <div className="spinner-ring" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu size={16} className="text-violet-400" />
        </div>
      </div>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
}
