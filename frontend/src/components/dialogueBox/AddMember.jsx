import React, { useRef } from "react";
import "./Dialogue.css";

export default function AddMember() {
  const dialog = useRef();

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };
  return (
    <div className="dialogue-container">
      <dialog ref={dialog} className="dialogue">
        <p>Je suis le dialogue</p>
        <button onClick={closeHandler} type="button">
          Fermer
        </button>
      </dialog>
      <button type="button" onClick={openHandler}>
        Ajouter un Membre
      </button>
    </div>
  );
}
