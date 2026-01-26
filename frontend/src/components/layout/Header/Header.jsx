import React, { useState, useRef, useCallback } from 'react';
import AddGroup from '../../dialogueBox/AddGroup';
import Profile from '../../dialogueBox/Profile';
import ShowGroupInfo from '../../dialogueBox/ShowGroupInfo';
import Avatar from '../../ui/Avatar';
import './Header.css';

export default function Header({ 
  currentGroup, 
  onToggleSidebar,
  onRefreshGroups,
  onGroupDeleted,
  onGroupRefresh
}) {
  const addGroupRef = useRef(null);
  const profileRef = useRef(null);
  const [showGroupInfoOpen, setShowGroupInfoOpen] = useState(false);

  const handleAddGroupClick = useCallback(() => {
    if (addGroupRef.current) {
      const button = addGroupRef.current.querySelector('.add-group-btn');
      if (button) {
        button.click();
      }
    }
  }, []);

  const handleProfileClick = useCallback(() => {
    if (profileRef.current) {
      const button = profileRef.current.querySelector('.header-profile');
      if (button) {
        button.click();
      }
    }
  }, []);

  const handleGroupClick = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (currentGroup) {
      setShowGroupInfoOpen(true);
    }
  }, [currentGroup]);

  return (
    <>
      <header className="app-header-modern">
        <div className="header-left">
          <button 
            className="header-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {currentGroup ? (
            <div className="header-group-info" onClick={handleGroupClick}>
              <Avatar
                src={currentGroup.image ? `http://127.0.0.1:8000/db/groupProfile/${currentGroup.image}` : null}
                name={currentGroup.name}
                size="md"
              />
              <div className="header-group-details">
                <div className="header-group-name">{currentGroup.name}</div>
                {currentGroup.description && (
                  <div className="header-group-description">{currentGroup.description}</div>
                )}
              </div>
              <button
                className="header-group-info-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGroupInfoOpen(true);
                }}
                title="Informations du groupe"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14V10M10 6H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="header-no-group">
              <p className="header-no-group-text">Sélectionnez une conversation</p>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="header-add-group-wrapper" ref={addGroupRef}>
            <AddGroup getGroups={onRefreshGroups || (() => {})} />
          </div>
          <button
            className="header-action-btn-modern"
            onClick={handleAddGroupClick}
            title="Créer un groupe"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="header-profile-wrapper" ref={profileRef}>
            <Profile />
          </div>
          <button
            className="header-profile-btn-modern"
            onClick={handleProfileClick}
            aria-label="User menu"
            type="button"
          >
            <img src="./images/profile_user.svg" alt="Profile" className="header-profile-img" />
          </button>
        </div>
      </header>

      {/* ShowGroupInfo avec état contrôlé */}
      {currentGroup && (
        <ShowGroupInfo
          id={currentGroup.id}
          image={currentGroup.image}
          name={currentGroup.name}
          description={currentGroup.description}
          isOpen={showGroupInfoOpen}
          onGroupDeleted={() => {
            if (onGroupDeleted) {
              onGroupDeleted();
            }
            setShowGroupInfoOpen(false);
          }}
          onRefresh={() => {
            if (onGroupRefresh) {
              onGroupRefresh();
            }
          }}
          onClose={() => setShowGroupInfoOpen(false)}
        />
      )}
    </>
  );
}
