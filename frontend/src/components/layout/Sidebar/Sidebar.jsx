import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Avatar from '../../ui/Avatar';
import { GroupsListSkeleton } from '../../loading/Skeleton';
import AddGroup from '../../dialogueBox/AddGroup';
import './Sidebar.css';

export default function Sidebar({ 
  onSelectGroup, 
  selectedGroupId, 
  isVisible = true,
  onRefresh 
}) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const addGroupRef = useRef(null);

  const fetchGroups = useCallback(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/v1.0.0/get/groups", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setGroups(res.data.data[0] || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des groupes");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchGroups();
    if (onRefresh) {
      // Exposer la fonction de refresh au parent
      onRefresh(fetchGroups);
    }
  }, [fetchGroups, onRefresh]);

  // Recharger les groupes quand onRefresh change
  useEffect(() => {
    if (onRefresh && typeof onRefresh === 'function') {
      // La fonction de refresh est déjà définie
    }
  }, [onRefresh]);

  const handleGroupClick = (group) => {
    localStorage.setItem("groupId", group.id);
    onSelectGroup(group);
  };

  const handleAddGroupClick = () => {
    // Déclencher le clic sur le bouton AddGroup
    if (addGroupRef.current) {
      const button = addGroupRef.current.querySelector('.add-group-btn');
      if (button) {
        button.click();
      }
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className="sidebar-modern">
      <div className="sidebar-add-group-wrapper" ref={addGroupRef}>
        <AddGroup getGroups={fetchGroups} />
      </div>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Conversations</h2>
        <button 
          className="sidebar-new-chat-btn"
          onClick={handleAddGroupClick}
          title="Nouvelle conversation"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar-search-input"
        />
      </div>

      <div className="sidebar-content">
        {loading ? (
          <GroupsListSkeleton count={6} />
        ) : filteredGroups.length === 0 ? (
          <div className="sidebar-empty">
            {searchQuery ? (
              <p>Aucun résultat trouvé</p>
            ) : (
              <>
                <p>Aucun groupe disponible</p>
                <p className="sidebar-empty-hint">Créez votre premier groupe pour commencer</p>
              </>
            )}
          </div>
        ) : (
          <div className="sidebar-groups">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className={`sidebar-group-item ${
                  selectedGroupId === group.id ? 'active' : ''
                }`}
                onClick={() => handleGroupClick(group)}
              >
                <Avatar
                  src={
                    group.image
                      ? `http://127.0.0.1:8000/db/groupProfile/${group.image}`
                      : null
                  }
                  name={group.name}
                  size="lg"
                />
                <div className="sidebar-group-info">
                  <div className="sidebar-group-name">{group.name}</div>
                  {group.description && (
                    <div className="sidebar-group-description">
                      {group.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
