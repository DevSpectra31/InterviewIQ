import { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// ─── Toast Context ──────────────────────────────────────────────────
const ToastContext = createContext(null);

let toastIdCounter = 0;

/**
 * Toast provider — wraps the app and provides addToast function.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications.
 * @returns {{ addToast: function, removeToast: function }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ─── Icons Map ──────────────────────────────────────────────────────
const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
};

// ─── Toast Item ─────────────────────────────────────────────────────
function ToastItem({ toast, onClose }) {
  const Icon = iconMap[toast.type] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`toast ${toast.type}`}
    >
      <span className={`toast-icon ${colorMap[toast.type]}`}>
        <Icon size={20} />
      </span>
      <div className="toast-content">
        {toast.title && <p className="toast-title">{toast.title}</p>}
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={16} />
      </button>
      {toast.duration > 0 && (
        <div
          className="toast-progress"
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      )}
    </motion.div>
  );
}

// ─── Default Export Banner Toast Component ──────────────────────────
export default function Toast({ type = 'info', message, title, onClose }) {
  if (!message) return null;
  const Icon = iconMap[type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium ${
        type === 'error'
          ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          : type === 'success'
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 shrink-0 ${colorMap[type] || 'text-slate-400'}`} />
        <div>
          {title && <span className="font-bold block">{title}</span>}
          <span>{message}</span>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
