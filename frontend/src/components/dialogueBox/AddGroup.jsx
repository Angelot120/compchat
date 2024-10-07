import React, { useRef, useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import "./Dialogue.css";
import { toast, ToastContainer } from "react-toastify";
import LoadingIndicator from "../loading/LoadingIndicator";
import axios from "axios";

export default function AddGroup({ getGroups }) {
  const dialog = useRef();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fromData = new FormData();
    if (!name) {
      toast.error("Veuillez renseiger le nom du groupe !");
      setLoading(false);
      return;
    }

    fromData.append("name", name);
    fromData.append("description", description);
    fromData.append("image", profile);

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
        setTimeout(function () {
          setLoading(false);
        }, 3500);
      } else {
        toast.error(response.data.message);
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

    setName("");
    setProfile("");
    setDescription("");
    getGroups();
    closeHandler();
  };

  return (
    <div className="dialogue-container">
      <ToastContainer stacked position="bottom-left" />
      <dialog ref={dialog} className="dialogue">
        <div onClick={closeHandler} className="close-btn">
          Fermer
        </div>

        <form onSubmit={handlerSubmit} className="create-new-group-form">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"Le nom du groupe ici ..."}
            type={"text"}
            label={"Donnez un nom à votre groupe."}
            reference={"name"}
            className={"form-input"}
            inputClassName={"input"}
          />
          <br />

          {profile && (
            <img src={imagePreview} alt="Uploaded" className="profile-img" />
          )}
          <p>Veuillez choisir une photo de profile.</p>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <br />
          <br />
          <p>Description du groupe : </p>
          <textarea
            className="description"
            name="description"
            id=""
            cols="16"
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {loading && <LoadingIndicator />}

          <Button text={"Créer"} type={"submit"} className={"btn-primary"} />
        </form>
      </dialog>
      <div type="button" onClick={openHandler} className="add-group-btn">
        <h2>+</h2>
      </div>
    </div>
  );
}
