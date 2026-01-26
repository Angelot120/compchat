import React from "react";
import "./Skeleton.css";

/**
 * Composant Skeleton réutilisable pour les états de chargement
 * @param {string} variant - Type de skeleton: 'text', 'circular', 'rectangular', 'group-item', 'message', 'member'
 * @param {number} width - Largeur du skeleton (en px, %, ou autre unité CSS)
 * @param {number} height - Hauteur du skeleton (en px, %, ou autre unité CSS)
 * @param {number} lines - Nombre de lignes pour variant 'text'
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Skeleton({ 
  variant = 'rectangular', 
  width, 
  height, 
  lines = 1,
  className = '' 
}) {
  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'circular') {
    return (
      <div 
        className={`skeleton skeleton-circular ${className}`}
        style={style}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div className={`skeleton-text-container ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`skeleton skeleton-text ${index === lines - 1 && lines > 1 ? 'skeleton-text-last' : ''}`}
            style={index === lines - 1 && lines > 1 ? { width: '60%' } : {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton pour un élément de groupe dans la sidebar
 */
export function GroupItemSkeleton() {
  return (
    <div className="skeleton-group-item">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="skeleton-group-item-content">
        <Skeleton variant="text" width="70%" height={16} lines={1} />
        <Skeleton variant="text" width="50%" height={12} lines={1} />
      </div>
    </div>
  );
}

/**
 * Skeleton pour une liste de groupes
 */
export function GroupsListSkeleton({ count = 5 }) {
  return (
    <div className="skeleton-groups-list">
      {Array.from({ length: count }).map((_, index) => (
        <GroupItemSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour un message de chat
 */
export function MessageSkeleton({ isSent = false }) {
  return (
    <div className={`skeleton-message ${isSent ? 'skeleton-message-sent' : 'skeleton-message-received'}`}>
      {!isSent && <Skeleton variant="circular" width={40} height={40} />}
      <div className="skeleton-message-content">
        {!isSent && <Skeleton variant="text" width="80px" height={12} lines={1} />}
        <Skeleton variant="rectangular" width={isSent ? "200px" : "180px"} height="60px" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour une liste de messages
 */
export function MessagesListSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-messages-list">
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} isSent={index % 3 === 0} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour un membre dans la liste des membres
 */
export function MemberItemSkeleton() {
  return (
    <div className="skeleton-member-item">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="skeleton-member-item-content">
        <Skeleton variant="text" width="60%" height={14} lines={1} />
      </div>
    </div>
  );
}

/**
 * Skeleton pour une liste de membres
 */
export function MembersListSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-members-list">
      {Array.from({ length: count }).map((_, index) => (
        <MemberItemSkeleton key={index} />
      ))}
    </div>
  );
}
