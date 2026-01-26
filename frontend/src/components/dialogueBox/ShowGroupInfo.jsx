import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import AddMember from "./AddMember";
import { toast } from "react-toastify";
import { MembersListSkeleton } from "../loading/Skeleton";
import "./Dialogue.css";

export default function ShowGroupInfo({ id, image, name, description, onGroupDeleted, onRefresh, onClose, isOpen: externalIsOpen }) {
  const dialog = useRef(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Utiliser l'état externe si fourni, sinon l'état interne
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const fetchMembers = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1.0.0/get/members/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMembers(response.data.data[0] || []);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Ouvrir/fermer le dialog selon l'état isOpen
  useEffect(() => {
    if (isOpen) {
      // Ouvrir le dialog seulement si isOpen est true
      if (dialog.current && !dialog.current.open) {
        dialog.current.showModal();
        fetchMembers();
      }
    } else {
      // Fermer le dialog si isOpen est false
      if (dialog.current && dialog.current.open) {
        dialog.current.close();
        setShowDeleteConfirm(false);
      }
    }
  }, [isOpen, fetchMembers]);

  // Fermer le dialog
  const handleClose = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (dialog.current && dialog.current.open) {
      dialog.current.close();
      setShowDeleteConfirm(false);
    }
    
    // Fermer via l'état
    if (externalIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    
    // Notifier le parent que le dialog est fermé
    if (onClose) {
      onClose();
    }
  }, [onClose, externalIsOpen]);

  const handleMemberAdded = useCallback(() => {
    fetchMembers();
    if (onRefresh) {
      onRefresh();
    }
  }, [fetchMembers, onRefresh]);

  const handleDeleteGroup = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    try {
      // Essayer d'abord avec DELETE, sinon avec POST
      let response;
      try {
        response = await axios.delete(
          `http://127.0.0.1:8000/api/v1.0.0/delete/group/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      } catch (deleteError) {
        // Si DELETE ne fonctionne pas, essayer POST avec _method
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        response = await axios.post(
          `http://127.0.0.1:8000/api/v1.0.0/delete/group/${id}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      }

      if (response.data?.success || response.status === 200 || response.status === 204) {
        toast.success("Le groupe a été supprimé avec succès");
        handleClose();
        if (onGroupDeleted) {
          onGroupDeleted();
        }
      } else {
        toast.error(response.data?.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      // Si l'API n'existe pas encore, on simule la suppression côté frontend
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        toast.warning("La route de suppression n'existe pas encore côté backend. Veuillez l'implémenter.");
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression du groupe");
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };


  // Ne rendre le dialog que si isOpen est true
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <dialog 
        ref={dialog} 
        className="dialogue dialogue-enhanced"
        onClose={() => {
          setShowDeleteConfirm(false);
          if (onClose) {
            onClose();
          }
        }}
        onClick={(e) => {
          // Fermer si on clique sur le backdrop
          if (e.target === dialog.current) {
            handleClose(e);
          }
        }}
      >
        <div className="dialogue-header" onClick={(e) => e.stopPropagation()}>
          <h2 className="dialogue-title">Informations du groupe</h2>
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
          <div className="group-info-content-enhanced">
            {/* Image du groupe */}
            <div className="group-image-section">
              {image ? (
                <a 
                  href={`http://127.0.0.1:8000/db/groupProfile/${image}`} 
                  download
                  className="group-image-link"
                >
                  <img
                    src={`http://127.0.0.1:8000/db/groupProfile/${image}`}
                    alt="profile"
                    className="group-image-large"
                  />
                </a>
              ) : (
                <div className="group-image-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Informations du groupe */}
            <div className="group-info-sections">
              <div className="info-section">
                <label className="info-label">Nom du groupe</label>
                <h3 className="info-value-large">{name || "Sans nom"}</h3>
              </div>

              {description && (
                <div className="info-section">
                  <label className="info-label">Description</label>
                  <p className="info-value">{description}</p>
                </div>
              )}

              {/* Section Membres */}
              <div className="members-section">
                <div className="members-header">
                  <label className="info-label">
                    Membres du groupe <span className="member-count">({members.length})</span>
                  </label>
                  {/* AddMember avec contrôle d'état */}
                  <AddMember 
                    id={id} 
                    onMemberAdded={handleMemberAdded}
                    triggerButton={
                      <Button
                        variant="secondary"
                        size="sm"
                        className="add-member-inline-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px' }}>
                          <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Ajouter
                      </Button>
                    }
                  />
                </div>

                {loading ? (
                  <MembersListSkeleton count={4} />
                ) : members.length === 0 ? (
                  <div className="empty-state-members">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <p>Aucun membre</p>
                  </div>
                ) : (
                  <div className="members-list-enhanced">
                    {members.map((member, index) => (
                      <div key={index} className="member-item-enhanced">
                        <Avatar 
                          name={member.email || member.name || "U"} 
                          size="md"
                        />
                        <div className="member-info">
                          <div className="member-name">
                            {member.email || member.name || "Membre"}
                          </div>
                          {member.id === 1 && (
                            <span className="admin-badge-enhanced">Admin</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="group-actions">
                {!showDeleteConfirm ? (
                  <Button
                    variant="danger"
                    size="md"
                    onClick={handleDeleteGroup}
                    disabled={deleting}
                    className="delete-group-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                      <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Supprimer le groupe
                  </Button>
                ) : (
                  <div className="delete-confirm">
                    <p className="delete-confirm-text">Êtes-vous sûr de vouloir supprimer ce groupe ?</p>
                    <div className="delete-confirm-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteGroup}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32">
                                <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                              </circle>
                            </svg>
                            Suppression...
                          </>
                        ) : (
                          "Confirmer"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
