import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Styled form input with icon, label, error state, and password toggle.
 *
 * @param {object} props
 * @param {string} props.label - Input label text
 * @param {string} props.type - Input type (text, email, password)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Controlled value
 * @param {function} props.onChange - Change handler
 * @param {import('lucide-react').LucideIcon} props.icon - Lucide icon component
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.id] - Input ID
 * @param {boolean} [props.required] - Required flag
 * @param {string} [props.autoComplete] - Auto-complete hint
 */
export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  id,
  required = false,
  autoComplete,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-violet-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {Icon && (
          <span className="form-input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`form-input ${error ? 'error' : ''} ${!Icon ? '!pl-3.5' : ''}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
