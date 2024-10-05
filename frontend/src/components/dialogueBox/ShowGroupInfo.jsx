import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function ShowGroupInfo({ id, image, name, description }) {
  const dialog = useRef();

  const [members, setMembers] = useState([]);

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/v1.0.0/get/members/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setMembers(data.data[0]);
        console.log(data.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <dialog ref={dialog} className="dialogue">
        <div onClick={closeHandler} className="close-btn">
          Fermer
        </div>
        <br /> <br />
        {image ? (
          <a href={`http://127.0.0.1:8000/db/groupProfile/${image}`} download>
            <img
              src={`http://127.0.0.1:8000/db/groupProfile/${image}`}
              // src={group.image || "./images/profile_user.svg"}
              alt="profile"
              className="profile-image"
            />
          </a>
        ) : (
          <img
            src={"./images/profile_user.svg"}
            alt="profile"
            className="profile-image"
          />
        )}
        <h3>{name}</h3>
        <br />
        <p>{description}</p>
        <br />
        <h4>Voici les membres du groupe : </h4>
        {members.map((member, index) => (
          <div key={index}>
            <p>
              {member.email} {member.id == 1 && " (Admin)"}
            </p>
          </div>
        ))}
      </dialog>

      <div className="show-group-info" onClick={openHandler}>
        {image ? (
          <img
            src={`http://127.0.0.1:8000/db/groupProfile/${image}`}
            // src={group.image || "./images/profile_user.svg"}
            alt="profile"
            className="profile-image"
          />
        ) : (
          <img
            src={"./images/profile_user.svg"}
            alt="profile"
            className="profile-image"
          />
        )}
        <p> {name}</p>
      </div>
    </div>
  );
}
