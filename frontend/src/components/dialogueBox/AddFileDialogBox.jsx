import React, { useCallback, useRef, useState } from "react";
import Button from "../ui/Button";
import "./Dialogue.css";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function AddFileDialogBox({ groupId, onFileSent }) {
  const dialog = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
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
      setFiles([]);
    }
  }, []);

  // Dropzone - seulement actif si isOpen est true
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg", ".webp"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10 MB
    disabled: !isOpen, // Désactiver si le dialog n'est pas ouvert
    noClick: !isOpen,
    noKeyboard: !isOpen,
    onDrop: useCallback((acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error("Certains fichiers sont trop volumineux ou dans un format non supporté");
      }
      const filePreviews = acceptedFiles.map((file) => {
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
        return {
          id: uuidv4(),
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      });
      setFiles((prevFiles) => [...prevFiles, ...filePreviews]);
      setIsDragActive(false);
    }, []),
    onDropRejected: useCallback((fileRejections) => {
      toast.error("Format de fichier non valide ou fichier trop volumineux (max 10MB)");
      setIsDragActive(false);
    }, []),
    onDragEnter: () => {
      if (isOpen) {
        setIsDragActive(true);
      }
    },
    onDragLeave: () => {
      setIsDragActive(false);
    },
  });

  const handleRemoveFile = useCallback((fileId) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((file) => file.id !== fileId);
    });
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📽️";
    return "📎";
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier !");
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = files.map(async (fileItem) => {
        // Vérifier que le fichier est bien un objet File
        if (!(fileItem.file instanceof File)) {
          console.error("Invalid file object:", fileItem.file);
          throw new Error("Fichier invalide");
        }

        const formData = new FormData();
        
        // S'assurer que le fichier est bien un objet File
        if (!(fileItem.file instanceof File)) {
          console.error("Invalid file object:", fileItem.file);
          throw new Error("Fichier invalide");
        }
        
        // Attacher le fichier avec le bon nom de champ
        formData.append("chat", fileItem.file, fileItem.file.name);
        
        // S'assurer que group_id est bien défini
        const groupIdValue = groupId || localStorage.getItem("groupId");
        if (!groupIdValue) {
          throw new Error("Group ID manquant");
        }
        
        // Convertir en nombre pour Laravel (comme dans ChatModern.jsx)
        const groupIdNum = Number(groupIdValue);
        if (isNaN(groupIdNum)) {
          throw new Error("Group ID invalide");
        }
        
        formData.append("group_id", groupIdNum);

        // Log pour débogage
        console.log("Uploading file:", {
          fileName: fileItem.file.name,
          fileSize: fileItem.file.size,
          fileType: fileItem.file.type,
          groupId: groupIdNum,
          isFile: fileItem.file instanceof File,
          formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
            key,
            value: value instanceof File ? `File: ${value.name}` : value
          }))
        });

        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1.0.0/send/chat",
          formData,
          {
            headers: {
              // Ne PAS définir Content-Type - axios le fait automatiquement pour FormData
              // Cela permet à axios de définir le bon boundary pour multipart/form-data
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        return response.data?.success || false;
      });

      const results = await Promise.all(uploadPromises);
      
      const successCount = results.filter(r => r === true).length;
      
      if (successCount === files.length) {
        toast.success(`${files.length} fichier(s) envoyé(s) avec succès !`);
        files.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        setFiles([]);
        handleClose();
        if (onFileSent) {
          onFileSent();
        }
      } else if (successCount > 0) {
        toast.warning(`${successCount} fichier(s) envoyé(s) sur ${files.length}`);
        // Nettoyer quand même les previews
        files.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        setFiles([]);
        if (onFileSent) {
          onFileSent();
        }
      } else {
        toast.error("Aucun fichier n'a pu être envoyé");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Une erreur s'est produite lors de l'envoi";
      toast.error(errorMessage);
      
      // Afficher plus de détails dans la console pour le débogage
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  // Ne rendre le dialog que si isOpen est true
  if (!isOpen) {
    return (
      <button 
        type="button" 
        onClick={handleOpen} 
        className="file-attach-btn"
        title="Joindre un fichier"
        aria-label="Joindre un fichier"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38782 15.78 1.38782C16.8415 1.38782 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32845 19.7822 5.39C19.7822 6.45155 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03473 17.7853 8.52573 17.9961 8 17.9961C7.47427 17.9961 6.96527 17.7853 6.59 17.41C6.21473 17.0347 6.00391 16.5257 6.00391 16C6.00391 15.4743 6.21473 14.9653 6.59 14.59L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  return (
    <>
      <dialog 
        ref={dialog}
        className="dialogue dialogue-enhanced file-upload-dialog"
        onClose={() => {
          setIsOpen(false);
          setFiles([]);
        }}
        onClick={(e) => {
          if (e.target === dialog.current) {
            handleClose(e);
          }
        }}
      >
        <div className="dialogue-header" onClick={(e) => e.stopPropagation()}>
          <h2 className="dialogue-title">Envoyer des fichiers</h2>
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
          <form onSubmit={handlerSubmit} className="send-file-form-enhanced">
            <div
              {...getRootProps({
                className: `file-dropzone-enhanced ${isDragActive ? "drag-active" : ""}`,
              })}
            >
              <input {...getInputProps()} />
              {files.length === 0 ? (
                <div className="file-dropzone-placeholder">
                  <div className="file-upload-icon-large">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="file-dropzone-text">Glissez-déposez vos fichiers ici</p>
                  <p className="file-dropzone-hint">ou cliquez pour sélectionner</p>
                  <p className="file-dropzone-info">Max 5 fichiers • 10MB par fichier</p>
                </div>
              ) : (
                <div className="files-preview-list">
                  {files.map((fileItem) => (
                    <div key={fileItem.id} className="file-preview-item">
                      {fileItem.preview ? (
                        <div className="file-preview-image">
                          <img src={fileItem.preview} alt={fileItem.name} />
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(fileItem.id);
                            }}
                            aria-label="Supprimer"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="file-preview-document">
                          <div className="file-icon-large">{getFileIcon(fileItem.type)}</div>
                          <div className="file-info">
                            <div className="file-name">{fileItem.name}</div>
                            <div className="file-size">{formatFileSize(fileItem.size)}</div>
                          </div>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(fileItem.id);
                            }}
                            aria-label="Supprimer"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {files.length > 0 && (
              <Button 
                type="submit" 
                variant="primary"
                size="lg"
                disabled={loading}
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
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                      <path d="M14 2L6 10M6 10L6 6M6 10L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Envoyer {files.length} fichier{files.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            )}
          </form>
        </div>
      </dialog>
      
      {/* Bouton pour ouvrir le dialog */}
      <button 
        type="button" 
        onClick={handleOpen} 
        className="file-attach-btn"
        title="Joindre un fichier"
        aria-label="Joindre un fichier"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.005 21.9983C6.41282 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38782 15.78 1.38782C16.8415 1.38782 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32845 19.7822 5.39C19.7822 6.45155 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03473 17.7853 8.52573 17.9961 8 17.9961C7.47427 17.9961 6.96527 17.7853 6.59 17.41C6.21473 17.0347 6.00391 16.5257 6.00391 16C6.00391 15.4743 6.21473 14.9653 6.59 14.59L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
}
