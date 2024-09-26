import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import AddMember from "../../components/dialogueBox/AddMember";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import AddFileDialogBox from "../../components/dialogueBox/AddFileDialogBox";
import ImageBtn from "../../components/button/ImageBtn";
import { toast, ToastContainer } from "react-toastify";

export default function Chat({ group }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [senders, setSenders] = useState(null);

  // console.log(group);

  useEffect(() => {
    setLoading(true);
    const id = group.id;
    const fetchChat = () => {
      if (id) {
        try {
          axios
            .get(`http://127.0.0.1:8000/api/v1.0.0/get/chat/${id}`, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
            .then((res) => {
              setChats(res.data.data.chats);
              console.log(res.data.data.chats);
              setSenders(res.data.data.senders);
              console.log(res.data.data.senders);
              setUserId(res.data.data.userId);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              toast.error(
                "Une erreur est survenue lors du chargement des données !"
              );
            });
        } catch (err) {
          console.error(err);
          toast.error(
            "Une erreur est survenue lors du chargement des données !"
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchChat();
  }, [group.id]);

  if (!group.id) {
    return (
      <div className="no-chat">
        <img src={"/images/messages.svg"} alt="" height={200} />
        <p>Veuillez sélectionner un groupe pour commancer la discussion.</p>
      </div>
    );
  }

  console.log(chats);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!message) {
      toast.error("Veuillez renter un message !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("chat", message);
      formData.append("group_id", group.id);

      const sentMsg = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/send/chat",

        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setMessage("");

      if (sentMsg.data.success) {
        toast.success("Le message a été envoyé avec succès !");
        setTimeout(function () {
          setLoading(false);
        }, 3500);
      } else {
        toast.error(sentMsg.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
      console.log("Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   {
  //     loading && <LoadingIndicator />;
  //   }
  // }
  // setLoading(true);
  // setLoading(false);

  const files = chats.data;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // chats.forEach(chat) => (

  //   console.log(chat[0].)
  // )

  // const fileExtension = files.chat.split(".").pop();

  // const handleDownload = () => {
  //   window.location.href = `/path/to/download/${file.chat.data}`;
  // };

  // if (userChats)
  //   userChats.forEach((userChat, i) => {
  //     const exists = chats.some((chat) => chat.user_id == userChat[i]);
  //     console.log(exists, (chat) => chat.user_id, i);
  //   });

  return (
    <div>
      <ToastContainer stacked position="bottom-left" />
      {/* {id ? id : "Null"} */}
      {/* <button>Inviter un membre + </button> */}

      <div className="group-all-info">
        <div className="group-profile">
          <img
            src={group.image || "./images/profile_user.svg"}
            alt="profile"
            className="profile-image"
          />
          <p> {group.name}</p>
        </div>
        <AddMember id={group.id} />
      </div>
      <br />
      {loading && <LoadingIndicator />}

      <div className="all-chats">
        {chats.map((chat, index) => (
          <div key={chat.id}>
            {userId !== chat.user_id ? (
              <div className="receiver-chat">
                <div className="one-chat">
                  <div className="chat-item receiver-chat-item">
                    <p>{chat.chat}</p>
                  </div>
                  {formatDate(chat.created_at)}
                </div>
                <p>{senders[index].id === chat.user_id ? senders[index].name : "Utilisateur"}</p>
              </div>
            ) : (
              <div className="sender-chat">
                <div className="one-chat">
                  {formatDate(chat.created_at)}
                  <div className="chat-item sender-chat-item">
                    <p>{chat.chat}</p>
                  </div>
                </div>
                <p>vous</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <br />
      <br />
      <br />

      <div className="send-chat-input">
        <div></div>
        <div className="send-chat-session">
          <AddFileDialogBox />

          <form onSubmit={handlerSubmit} className="chat-form">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type={"text"}
              reference={"message"}
              placeholder={"Votre message ici..."}
              className={"chatInput"}
            />

            <ImageBtn
              disabled={message ? false : true || loading ? false : true}
              type={"submit"}
              text={loading ? "Envoie en cours..." : "Envoyer"}
              onClick={handlerSubmit}
              className={"send-btn"}
            />
          </form>
        </div>
        <br />
      </div>
    </div>
  );
}

// <div>
// <div className="file-display">
//   {fileExtension === "pdf" ? (
//     <div>
//       <embed
//         src={`/${file.chat}`}
//         type="application/pdf"
//         width="600"
//         height="400"
//       />
//       <button onClick={handleDownload}>Télécharger PDF</button>
//     </div>
//   ) : fileExtension.match(/jpg|jpeg|png|gif|svg|webp/) ? (
//     <div>
//       <img
//         src={`/${file.chat}`}
//         alt="Image"
//         style={{ maxWidth: "100%", height: "auto" }}
//       />
//       <button onClick={handleDownload}>Télécharger Image</button>
//     </div>
//   ) : fileExtension === "txt" ? (
//     <div>
//       <pre>{/* Récupérer le contenu du fichier texte ici */}</pre>
//       <button onClick={handleDownload}>Télécharger Texte</button>
//     </div>
//   ) : (
//     <p>Type de fichier non pris en charge</p>
//   )}
// </div>
// </div>
