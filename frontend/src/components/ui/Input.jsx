import React from 'react';
import './Input.css';

/**
 * Composant Input moderne et réutilisable
 * @param {string} type - Type d'input (text, email, password, etc.)
 * @param {string} placeholder - Texte placeholder
 * @param {string} value - Valeur de l'input
 * @param {function} onChange - Handler de changement
 * @param {string} label - Label optionnel
 * @param {string} error - Message d'erreur
 * @param {boolean} disabled - État désactivé
 * @param {string} className - Classes CSS additionnelles
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  const baseClass = 'input-wrapper';
  const errorClass = error ? 'input-error' : '';
  const disabledClass = disabled ? 'input-disabled' : '';
  const sizeClass = `input-${size}`;
  
  const wrapperClasses = `${baseClass} ${errorClass} ${disabledClass} ${className}`.trim();
  const inputClasses = `input ${sizeClass}`.trim();

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && (
        <span className="input-error-message">
          {error}
        </span>
      )}
    </div>
  );
}
