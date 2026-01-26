import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "./Dialogue.css";

export default function Profile() {
  const dialog = useRef();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/v1.0.0/show/profile", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.data && response.data.data && response.data.data[0]) {
          setUser(response.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openHandler = useCallback((e) => {
    e?.stopPropagation();
    if (dialog.current && !dialog.current.open) {
      dialog.current.showModal();
    }
  }, []);

  const closeHandler = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (dialog.current && dialog.current.open) {
      dialog.current.close();
    }
  }, []);

  return (
    <div>
      <dialog 
        ref={dialog} 
        className="dialogue dialogue-enhanced"
        onClick={(e) => {
          if (e.target === dialog.current) {
            closeHandler(e);
          }
        }}
      >
        <div className="dialogue-header">
          <h2 className="dialogue-title">Mon profil</h2>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeHandler(e);
            }}
            className="close-btn"
            aria-label="Fermer"
          >
            <svg className="close-btn-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="dialogue-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-3xl)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Chargement...
              </div>
            </div>
          ) : (
            <div className="show-profile-box-center-items">
              <img
                src={"./images/profile_user.svg"}
                alt="Profile"
                className="profile-img"
              />

              <div style={{ width: '100%', textAlign: 'left', marginTop: 'var(--spacing-md)' }}>
                <div style={{ 
                  marginBottom: 'var(--spacing-md)',
                  paddingBottom: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--color-border)'
                }}>
                  <label style={{ 
                    fontSize: 'var(--font-size-xs)', 
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 'var(--spacing-xs)',
                    display: 'block'
                  }}>
                    Nom d'utilisateur
                  </label>
                  <p style={{ 
                    fontSize: 'var(--font-size-lg)', 
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}>
                    {user?.name || "Non défini"}
                  </p>
                </div>

                <div>
                  <label style={{ 
                    fontSize: 'var(--font-size-xs)', 
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 'var(--spacing-xs)',
                    display: 'block'
                  }}>
                    Email
                  </label>
                  <p style={{ 
                    fontSize: 'var(--font-size-base)', 
                    color: 'var(--color-text-secondary)',
                    margin: 0
                  }}>
                    {user?.email || "Non défini"}
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={logout}
                className="logout-btn"
                style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </dialog>
      <span onClick={(e) => {
        e.stopPropagation();
        openHandler(e);
      }} className="header-profile">
        <img src={"./images/profile_user.svg"} alt="" />
      </span>
    </div>
  );
}
