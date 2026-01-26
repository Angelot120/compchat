import React, { useRef, useState, useCallback, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./Dialogue.css";
import { toast } from "react-toastify";
import Skeleton from "../loading/Skeleton";
import axios from "axios";

export default function AddGroup({ getGroups }) {
  const dialog = useRef();
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Nettoyer l'URL de l'objet lors du démontage uniquement
  useEffect(() => {
    return () => {
      // Ne révoquer que lors du démontage du composant, pas à chaque changement
      if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {
          console.warn("Error revoking URL on unmount:", err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Vide pour ne s'exécuter qu'au démontage

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
      // Révoquer l'URL de l'objet pour libérer la mémoire
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setName("");
      setProfile(null);
      setDescription("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [imagePreview]);

  const handleFileChange = useCallback((e) => {
    const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
    
    if (file) {
      // Vérifier que c'est bien une image
      if (file.type && file.type.startsWith('image/')) {
        // Révoquer l'ancienne URL si elle existe AVANT de créer la nouvelle
        setImagePreview((prevPreview) => {
          if (prevPreview && typeof prevPreview === 'string' && prevPreview.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(prevPreview);
              console.log("🗑️ Old preview URL revoked:", prevPreview);
            } catch (err) {
              console.warn("Error revoking old URL:", err);
            }
          }
          return null;
        });
        
        setProfile(file);
        
        // Utiliser URL.createObjectURL comme dans AddFileDialogBox
        try {
          const preview = URL.createObjectURL(file);
          console.log("🖼️ Preview URL created:", preview);
          console.log("🖼️ Preview URL is blob:", preview.startsWith('blob:'));
          console.log("🖼️ Preview URL type:", typeof preview);
          
          // Utiliser un callback pour s'assurer que l'état est mis à jour correctement
          setImagePreview(() => {
            console.log("✅ Setting imagePreview to:", preview);
            return preview;
          });
        } catch (error) {
          console.error("Error creating object URL:", error);
          toast.error("Erreur lors de la création de l'aperçu");
        }
      } else {
        toast.error("Veuillez sélectionner une image valide (JPG, PNG, GIF, etc.)");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e);
  }, [handleFileChange]);

  const removeImage = useCallback((e) => {
    e.stopPropagation();
    // Révoquer l'URL de l'objet pour libérer la mémoire
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setProfile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview]);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fromData = new FormData();
    if (!name.trim()) {
      toast.error("Veuillez renseigner le nom du groupe !");
      setLoading(false);
      return;
    }

    fromData.append("name", name.trim());
    fromData.append("description", description.trim());
    if (profile) {
      fromData.append("image", profile);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/create/group",
        fromData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Le groupe a été créé avec succès !");
        
        // Fermer le dialog d'abord
        closeHandler();
        
        // Appeler getGroups pour rafraîchir la liste immédiatement
        // Utiliser setTimeout pour s'assurer que le backend a bien traité la création
        if (getGroups && typeof getGroups === 'function') {
          // Appeler immédiatement et aussi après un court délai pour être sûr
          getGroups();
          setTimeout(() => {
            getGroups();
          }, 300);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialogue-container">
      <dialog 
        ref={dialog} 
        className="dialogue dialogue-enhanced"
        onClick={(e) => {
          // Fermer si on clique sur le backdrop
          if (e.target === dialog.current) {
            closeHandler(e);
          }
        }}
      >
        <div className="dialogue-header">
          <h2 className="dialogue-title">Créer un nouveau groupe</h2>
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
          <form onSubmit={handlerSubmit} className="create-new-group-form">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du groupe"
              type="text"
              label="Nom du groupe"
              disabled={loading}
              required
            />

            <div className="file-upload-wrapper-enhanced">
              {imagePreview ? (
                <div className="image-preview-container">
                  <div className="image-preview-wrapper">
                    <img 
                      src={imagePreview}
                      alt="Preview de l'image" 
                      className="image-preview"
                      onLoad={(e) => {
                        console.log("✅ Image loaded successfully");
                        console.log("✅ Image src:", e.target.src);
                        console.log("✅ Image naturalWidth:", e.target.naturalWidth);
                        console.log("✅ Image naturalHeight:", e.target.naturalHeight);
                      }}
                      onError={(e) => {
                        console.error("❌ [Image] Error loading image preview");
                        console.error("❌ [Image] Image src that failed:", e.target.src);
                        console.error("❌ [Image] Expected blob URL:", imagePreview);
                        console.error("❌ [Image] Is blob URL?", imagePreview?.startsWith('blob:'));
                        console.error("❌ [Image] Image element:", e.target);
                        toast.error("Impossible d'afficher l'image");
                        if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
                          try {
                            URL.revokeObjectURL(imagePreview);
                          } catch (err) {
                            console.warn("Error revoking URL in onError:", err);
                          }
                        }
                        setImagePreview(null);
                        setProfile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    />
                    <div className="image-preview-overlay" style={{ zIndex: 5 }}>
                      <p>Cliquez pour changer l'image</p>
                      <p className="image-preview-hint">ou glissez-déposez une nouvelle image</p>
                    </div>
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeImage(e);
                      }}
                      aria-label="Supprimer l'image"
                      style={{ zIndex: 20 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <label 
                    htmlFor="group-image-upload" 
                    className="image-upload-label-overlay"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ zIndex: 10 }}
                  />
                </div>
              ) : (
                <label 
                  htmlFor="group-image-upload" 
                  className={`file-upload-label-enhanced ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="file-upload-placeholder">
                    <div className="upload-icon-wrapper">
                      <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 17L12 12L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="upload-text">Cliquez pour ajouter une photo de profil</p>
                    <p className="upload-hint">ou glissez-déposez une image ici</p>
                    <p className="upload-optional">Optionnel • JPG, PNG, GIF</p>
                  </div>
                </label>
              )}
              <input
                ref={fileInputRef}
                id="group-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-upload-input"
                disabled={loading}
              />
            </div>

            <div className="form-input">
              <label className="form-label">
                Description du groupe <span className="optional-text">(optionnel)</span>
                <span className="char-counter" style={{ 
                  float: 'right', 
                  fontSize: 'var(--font-size-xs)', 
                  color: description.length > 200 ? 'var(--color-error)' : 'var(--color-text-secondary)',
                  fontWeight: description.length > 200 ? 'var(--font-weight-semibold)' : 'normal'
                }}>
                  {description.length}/200
                </span>
              </label>
              <textarea
                className="description"
                name="description"
                placeholder="Décrivez le but de ce groupe..."
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setDescription(value);
                  }
                }}
                disabled={loading}
                rows={4}
                maxLength={200}
              />
              {description.length >= 200 && (
                <p style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--color-error)', 
                  marginTop: 'var(--spacing-xs)',
                  marginBottom: 0
                }}>
                  Limite de 200 caractères atteinte
                </p>
              )}
            </div>

            {loading && (
              <div className="loading-wrapper">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  <Skeleton variant="rectangular" width="100%" height="40px" />
                  <Skeleton variant="rectangular" width="100%" height="200px" />
                  <Skeleton variant="rectangular" width="100%" height="40px" />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              disabled={loading || !name.trim()}
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
                  Création en cours...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                    <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Créer le groupe
                </>
              )}
            </Button>
          </form>
        </div>
      </dialog>
      <div type="button" onClick={(e) => {
        e.stopPropagation();
        openHandler(e);
      }} className="add-group-btn">
        <h2>+</h2>
      </div>
    </div>
  );
}
