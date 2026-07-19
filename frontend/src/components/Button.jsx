/**
 * Reusable button with variant styles and loading state.
 *
 * @param {object} props
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant='primary'] - Visual style
 * @param {boolean} [props.loading=false] - Show spinner and disable
 * @param {boolean} [props.fullWidth=false] - Stretch to container width
 * @param {boolean} [props.disabled=false]
 * @param {'button' | 'submit' | 'reset'} [props.type='button']
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary:
      'px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20',
    secondary:
      'px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600',
    ghost:
      'px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/60',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="spinner-inline" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
