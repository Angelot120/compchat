import React, { useRef, useState } from "react";
import "./Dialogue.css";
import Input from "../input/Input";
import Button from "../button/Button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingIndicator from "../loading/LoadingIndicator";

export default function AddMember(id) {
  const dialog = useRef();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("email", email);
    formData.append("groupId", id.id);

    // console.log("Email:", email, "Group ID:", id.id);

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
      } else {
        toast.error(response.data.message);
      }

      // if (response.data.success) {
      //   toast.success("Le nouveau membre a été invité avec succès !");
      //   setTimeout(function () {
      //     setLoading(false);
      //   }, 3500);
      // } else {
      //   toast.error(response.data.message);
      //   setLoading(false);
      // }
    } catch (error) {
      // if (response.data.status == 400) {
      //   toast.error(response?.data?.data?.message);
      //   return;
      // }

      //   setLoading(false);
      //   toast.error(response?.data?.data?.message || "Une erreur s'est produite");
      //   console.log(error);
      // } finally {
      //   setLoading(false);
      // }
      const message =
        error.response?.data?.data?.message || "Une erreur s'est produite";
      toast.error(message);
      console.log(error);
    } finally {
      setLoading(false);
    }
    setEmail("");
    closeHandler();
  };

  return (
    <div className="dialogue-container">
      <ToastContainer stacked position="bottom-left" />
      <dialog ref={dialog} className="dialogue">
        <div onClick={closeHandler} className="close-btn">
          Fermer
        </div>

        <h2>Ajouter un nouveau membre</h2>
        <form onSubmit={handlerSubmit}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type={"email"}
            placeholder={"L'email du future nouveau membre ici..."}
            label={"Veuillez renseigner l'email du nouveau membre à ajouter."}
            inputClassName={"input"}
          />
          {loading && <LoadingIndicator />}
          <br />
          <Button type={"submit"} text={"Inviter"} className={"btn-primary"} />
        </form>
      </dialog>
      <div className="add-member-btn" onClick={openHandler}>
        <h2>+</h2>
      </div>
    </div>
  );
}
