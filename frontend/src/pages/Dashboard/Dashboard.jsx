import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Chat from "../Chat/ChatModern";
import "./Dashboard.css";

export default function Dashboard() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [refreshGroups, setRefreshGroups] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsValid(token);
    if (!token) {
      navigate("/");
      toast.error("Veuillez vous connecter !");
    }
  }, [navigate]);

  const handleToggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleSelectGroup = (group) => {
    setCurrentGroup(group);
  };

  const handleRefreshGroups = (refreshFn) => {
    // Stocker la fonction de refresh pour l'utiliser dans les composants enfants
    if (refreshFn) {
      setRefreshGroups(() => refreshFn);
    }
  };

  const handleGroupDeleted = () => {
    setCurrentGroup(null);
    if (refreshGroups) {
      refreshGroups();
    }
  };

  const handleGroupRefresh = () => {
    if (refreshGroups) {
      refreshGroups();
    }
  };

  if (!isValid) {
    return null;
  }

  return (
    <div className="dashboard-modern">
      <div className="app-layout">
        <Sidebar
          onSelectGroup={handleSelectGroup}
          selectedGroupId={currentGroup?.id}
          isVisible={isSidebarVisible}
          onRefresh={setRefreshGroups}
        />
        
        <div className="main-content">
          <Header
            currentGroup={currentGroup}
            onToggleSidebar={handleToggleSidebar}
            onRefreshGroups={refreshGroups || handleRefreshGroups}
            onGroupDeleted={handleGroupDeleted}
            onGroupRefresh={handleGroupRefresh}
          />
          
          <div className="chat-container">
            {currentGroup ? (
              <Chat 
                group={currentGroup} 
                onGroupDeleted={handleGroupDeleted}
                onRefresh={handleGroupRefresh}
              />
            ) : (
              <div className="chat-empty-state">
                <div className="empty-state">
                  <img src="/images/messages.svg" alt="Messages" />
                  <h3>Sélectionnez une conversation</h3>
                  <p>
                    Choisissez une conversation dans la barre latérale pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
