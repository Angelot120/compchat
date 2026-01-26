import React from 'react';
import './Avatar.css';

/**
 * Composant Avatar pour afficher les photos de profil
 * @param {string} src - URL de l'image
 * @param {string} alt - Texte alternatif
 * @param {string} name - Nom pour l'initiale si pas d'image
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} className - Classes CSS additionnelles
 */
export default function Avatar({ src, alt = '', name = '', size = 'md', className = '' }) {
  const sizeClass = `avatar-${size}`;
  const classes = `avatar ${sizeClass} ${className}`.trim();
  
  // Générer l'initiale si pas d'image
  const getInitial = () => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Couleur de fond basée sur le nom (pour la cohérence)
  const getBackgroundColor = () => {
    if (!name) return '#94a3b8';
    const colors = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={classes}
      style={!src ? { backgroundColor: getBackgroundColor() } : {}}
    >
      {src ? (
        <img src={src} alt={alt || name} className="avatar-image" />
      ) : (
        <span className="avatar-initial">{getInitial()}</span>
      )}
    </div>
  );
}
