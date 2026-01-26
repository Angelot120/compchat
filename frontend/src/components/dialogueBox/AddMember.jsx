import React, { useRef, useState, useCallback } from "react";
import "./Dialogue.css";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "../loading/Skeleton";

export default function AddMember({ id, onMemberAdded, triggerButton }) {
  const dialog = useRef(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // État React pour contrôler l'ouverture

  // Ouvrir le dialog - UNIQUEMENT appelé par le bouton
  const handleOpen = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Vérifier que c'est un événement utilisateur
    if (e && e.isTrusted === false) {
      return;
    }
    
    // Ouvrir via l'état React
    setIsOpen(true);
    
    // Attendre que l'état soit mis à jour avant d'appeler showModal
    setTimeout(() => {
      if (dialog.current && !dialog.current.open) {
        dialog.current.showModal();
      }
    }, 0);
  }, []);

  // Fermer le dialog
  const handleClose = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Fermer via l'état React
    setIsOpen(false);
    
    if (dialog.current && dialog.current.open) {
      dialog.current.close();
      setEmail("");
    }
  }, []);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!email.trim()) {
      toast.error("Veuillez renseigner un email valide");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("groupId", id);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/create/member",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Le nouveau membre a été invité avec succès !");
        if (onMemberAdded) {
          onMemberAdded();
        }
        handleClose();
      } else {
        toast.error(response.data.message || "Une erreur s'est produite");
      }
    } catch (error) {
      const message = error.response?.data?.data?.message || 
                     error.response?.data?.message || 
                     "Une erreur s'est produite";
      toast.error(message);
      console.error("Error adding member:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si un triggerButton est fourni, l'envelopper avec le handler
  if (triggerButton) {
    return (
      <>
        {isOpen && (
          <dialog 
            ref={dialog} 
            className="dialogue dialogue-enhanced"
            onClose={() => {
              setIsOpen(false);
              setEmail("");
            }}
            onClick={(e) => {
              if (e.target === dialog.current) {
                handleClose(e);
              }
            }}
          >
            <div className="dialogue-header" onClick={(e) => e.stopPropagation()}>
              <h2 className="dialogue-title">Ajouter un membre</h2>
              <button 
                type="button"
                onClick={handleClose}
                className="close-btn"
                aria-label="Fermer"
              >
                <svg className="close-btn-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="dialogue-content">
              <form onSubmit={handlerSubmit} className="add-member-form">
                <div className="form-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="email@exemple.com"
                  label="Email du membre à ajouter"
                  disabled={loading}
                  required
                />

                {loading && (
                  <div className="loading-wrapper">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center', padding: '20px' }}>
                      <Skeleton variant="rectangular" width="100%" height="40px" />
                      <Skeleton variant="text" width="80%" height={14} lines={2} />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary"
                  size="lg"
                  disabled={loading || !email.trim()}
                  className="btn-primary-enhanced"
                >
                  {loading ? (
                    <>
                      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                      Invitation en cours...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                        <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Inviter le membre
                    </>
                  )}
                </Button>
              </form>
            </div>
          </dialog>
        )}
        
        {/* Envelopper le triggerButton avec le handler */}
        <div onClick={handleOpen}>
          {triggerButton}
        </div>
      </>
    );
  }

  // Mode standalone (ancien comportement pour compatibilité)
  // Ne rendre le dialog que si isOpen est true
  if (!isOpen) {
    return (
      <div className="add-member-btn" onClick={handleOpen}>
        <h2>+</h2>
      </div>
    );
  }

  return (
    <>
      <dialog 
        ref={dialog} 
        className="dialogue dialogue-enhanced"
        onClose={() => {
          setIsOpen(false);
          setEmail("");
        }}
        onClick={(e) => {
          if (e.target === dialog.current) {
            handleClose(e);
          }
        }}
      >
        <div className="dialogue-header" onClick={(e) => e.stopPropagation()}>
          <h2 className="dialogue-title">Ajouter un membre</h2>
          <button 
            type="button"
            onClick={handleClose}
            className="close-btn"
            aria-label="Fermer"
          >
            <svg className="close-btn-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="dialogue-content">
          <form onSubmit={handlerSubmit} className="add-member-form">
            <div className="form-icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@exemple.com"
              label="Email du membre à ajouter"
              disabled={loading}
              required
            />

            {loading && (
              <div className="loading-wrapper">
                <LoadingIndicator />
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              disabled={loading || !email.trim()}
              className="btn-primary-enhanced"
            >
              {loading ? (
                <>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Invitation en cours...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                    <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Inviter le membre
                </>
              )}
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
}
