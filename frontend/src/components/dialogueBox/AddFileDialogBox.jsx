import React, { useCallback, useRef, useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import "./Dialogue.css";
import { toast, ToastContainer } from "react-toastify";
import { useDropzone } from "react-dropzone";
import LoadingIndicator from "../loading/LoadingIndicator";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function AddFileDialogBox() {
  const dialog = useRef();
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };

  const HandlertempImg = (e) => {
    e.preventDefault();
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg", ".webp"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5 MB
    onDrop: useCallback((acceptedFiles) => {
      const filePreviews = acceptedFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        return {
          id: uuidv4(),
          file,
          preview,
        };
      });
      setFiles((prevFiles) => [...prevFiles, ...filePreviews]);
      setIsDragActive(false);
    }, []),
    onDropRejected: useCallback((fileRejections) => {
      console.log("Fichiers rejetés:", fileRejections);
      toast.error("Format de fichier non valide");
      setIsDragActive(false);
    }, []),
    onDragEnter: () => {
      setIsDragActive(true);
    },
    onDragLeave: () => {
      setIsDragActive(false);
    },
    onDragOver: () => {
      setIsDragActive(true);
    },
  });

  const handleRemoveFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier !");
      setLoading(false);
      return;
    }
    const fromData = new FormData();

    files.forEach(async (file) => {
      fromData.append("chat", file.file);
      fromData.append("group_id", localStorage.getItem("groupId"));

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1.0.0/send/chat",

          fromData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (response.data.success) {
          toast.success("Fichiers envoyés avec succès !");
          setTimeout(function () {
            setLoading(false);
          }, 3500);
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error(
          error.response?.data?.message || "Une erreur s'est produite"
        );
        console.log("Error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    });

    setFiles([]);
    closeHandler();
  };

  return (
    <div className="dialogue-container">
      <ToastContainer stacked position="bottom-left" />
      <dialog ref={dialog} className="dialogue">
        <button onClick={closeHandler} type="button">
          Fermer
        </button>

        <form onSubmit={handlerSubmit}>
          {/* {profile && (
            <img src={profile} alt="Uploaded" className="profile-img" />
          )} */}
          <p>Veuillez choisir un fichier.</p>

          <div
            {...getRootProps({
              className: `dropzone ${isDragActive ? "drag-active" : ""}`,
            })}
          >
            <input {...getInputProps()} />
            <p className="dz-message">
              Glissez et déposez des fichiers ici, ou cliquez pour sélectionner
              des fichiers
            </p>

            <div className="preview-container">
              {files.map((file) => (
                <div key={file.id} className="dz-preview">
                  {file.file.type.startsWith("image/") ? (
                    <img src={file.preview} alt={file.file.name} />
                  ) : (
                    <p>{file.file.name}</p>
                  )}
                  <button onClick={() => handleRemoveFile(file.id)}>
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {loading && <LoadingIndicator />}

          <br />
          <br />
          <Button text={"Créer"} type={"submit"} />
        </form>
      </dialog>
      <div type="button" onClick={openHandler} className={"file"}>
        <img src={"./images/file_attach.svg"} alt="file" />
      </div>
    </div>
  );
}
