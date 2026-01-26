import React from 'react';
import './Button.css';

/**
 * Composant Button moderne et réutilisable
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - État désactivé
 * @param {string} className - Classes CSS additionnelles
 * @param {React.ReactNode} children - Contenu du bouton
 * @param {function} onClick - Handler de clic
 * @param {string} type - Type de bouton (button, submit, reset)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';
  
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
