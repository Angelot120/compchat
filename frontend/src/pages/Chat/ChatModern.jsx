import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { MessagesListSkeleton } from "../../components/loading/Skeleton";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import AddFileDialogBox from "../../components/dialogueBox/AddFileDialogBox";
import ShowGroupInfo from "../../components/dialogueBox/ShowGroupInfo";
import AddMember from "../../components/dialogueBox/AddMember";
import "./ChatModern.css";

export default function ChatModern({ group, onGroupDeleted, onRefresh }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [senders, setSenders] = useState({});
  const [showGroupInfoOpen, setShowGroupInfoOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchChat = async (id) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1.0.0/get/chat/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setChats(response.data.data.chats || []);
        setSenders(response.data.data.senders || {});
        setUserId(response.data.data.userId);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (group?.id) {
      fetchChat(group.id);
    }
  }, [group?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || sending) {
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("chat", message.trim());
      formData.append("group_id", group.id);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/send/chat",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setMessage("");
        await fetchChat(group.id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isFileType = (file) => {
    if (!file) return false;
    const extension = file.split(".").pop()?.toLowerCase();
    return ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension);
  };

  const isImageType = (file) => {
    if (!file) return false;
    const extension = file.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension);
  };

  const getFileName = (file) => {
    return file.split("/").pop();
  };

  const getFileIcon = (file) => {
    const extension = file.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: "/icons/pdf.png",
      doc: "/icons/docx.png",
      docx: "/icons/docx.png",
      xls: "/icons/xlsx.png",
      xlsx: "/icons/xlsx.png",
      ppt: "/icons/pptx.png",
      pptx: "/icons/pptx.png",
    };
    return icons[extension] || "/icons/file.png";
  };

  if (!group?.id) {
    return null; // Le Dashboard gère l'état vide
  }

  const sender = senders[0] || {};

  return (
    <div className="chat-modern" ref={chatContainerRef}>
      {/* Header de la conversation - Commenté pour le moment */}
      {/*
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-group-display">
            {group.image ? (
              <img
                src={`http://127.0.0.1:8000/db/groupProfile/${group.image}`}
                alt={group.name}
                className="chat-header-group-avatar"
              />
            ) : (
              <img
                src="./images/profile_user.svg"
                alt={group.name}
                className="chat-header-group-avatar"
              />
            )}
            <div className="chat-header-group-details">
              <div className="chat-header-group-name">{group.name}</div>
              {group.description && (
                <div className="chat-header-group-description">{group.description}</div>
              )}
            </div>
          </div>
          
          <button
            className="chat-header-info-btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowGroupInfoOpen(true);
            }}
            title="Informations du groupe"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14V10M10 6H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="chat-header-actions">
          <AddMember 
            id={group.id} 
            onMemberAdded={() => fetchChat(group.id)}
            triggerButton={
              <button
                className="chat-header-add-member-btn"
                title="Ajouter un membre"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            }
          />
        </div>
      </div>
      */}

      {/* Zone de messages */}
      <div className="chat-messages-area">
        {loading ? (
          <MessagesListSkeleton count={8} />
        ) : chats.length === 0 ? (
          <div className="chat-empty">
            <p>Aucun message</p>
            <p className="chat-empty-hint">
              Commencez la conversation en envoyant un message
            </p>
          </div>
        ) : (
          <div className="chat-messages-list">
            {chats.map((chat, index) => {
              const isSent = userId === chat.user_id;
              const senderInfo = Array.isArray(senders) 
                ? senders.find(s => s.id === chat.user_id) 
                : senders[chat.user_id] || {};

              return (
                <div
                  key={chat.id}
                  className={`message ${isSent ? "sent" : "received"}`}
                >
                  {!isSent && (
                    <Avatar
                      src={senderInfo.image || null}
                      name={senderInfo.name || "U"}
                      size="md"
                    />
                  )}
                  
                  <div className="message-content">
                    {!isSent && (
                      <div className="message-author">
                        {senderInfo.name || "Utilisateur"}
                      </div>
                    )}
                    
                    <div className="message-bubble">
                      {isFileType(chat.chat) ? (
                        <div className="message-file">
                          <img
                            src={getFileIcon(chat.chat)}
                            alt="File"
                            className="message-file-icon"
                          />
                          <a
                            href={`http://127.0.0.1:8000/${chat.chat}`}
                            download
                            className="message-file-link"
                          >
                            {getFileName(chat.chat)}
                          </a>
                        </div>
                      ) : isImageType(chat.chat) ? (
                        <a
                          href={`http://127.0.0.1:8000/${chat.chat}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="message-image-link"
                        >
                          <img
                            src={`http://127.0.0.1:8000/${chat.chat}`}
                            alt="Chat"
                            className="message-image"
                          />
                        </a>
                      ) : (
                        <p className="message-text">{chat.chat}</p>
                      )}
                    </div>
                    
                    <div className="message-time">
                      {formatTime(chat.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          {/* Ne rendre AddFileDialogBox que si le groupe existe */}
          {group?.id && (
            <AddFileDialogBox groupId={group.id} onFileSent={() => fetchChat(group.id)} />
          )}
          
          <form onSubmit={handleSubmit} className="chat-input-form">
            <Input
              type="text"
              placeholder="Tapez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
              className="input-chat"
              size="md"
            />
            
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!message.trim() || sending}
              className="chat-send-btn"
            >
              {sending ? (
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                  </circle>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* ShowGroupInfo avec contrôle d'état */}
      {group?.id && (
        <ShowGroupInfo
          id={group.id}
          image={group.image}
          name={group.name}
          description={group.description}
          isOpen={showGroupInfoOpen}
          onGroupDeleted={() => {
            if (onGroupDeleted) {
              onGroupDeleted();
            }
            setShowGroupInfoOpen(false);
          }}
          onRefresh={() => {
            fetchChat(group.id);
            if (onRefresh) {
              onRefresh();
            }
          }}
          onClose={() => {
            setShowGroupInfoOpen(false);
          }}
        />
      )}
    </div>
  );
}
