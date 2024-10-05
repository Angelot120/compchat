import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dialog = useRef();
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://127.0.0.1:8000/api/v1.0.0/show/profile", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => res.data)
        .then((data) => {
          setUser(data.data[0]);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openHandler = () => {
    dialog.current.showModal();
  };

  const closeHandler = () => {
    dialog.current.close();
  };

  return (
    <div>
      <dialog ref={dialog} className="dialogue">
        <div onClick={closeHandler} className="close-btn">
          Fermer
        </div>

        <div className="show-profile-box-center-items">
          <h2>Mon profile</h2>

          <img
            src={"./images/profile_user.svg"}
            alt=""
            className="profile-img"
          />

          <p>Nom d'utilisateur : {user.name}</p>
          <p>Email : {user.email}</p>

          <br />

          <div onClick={logout} className="logout-btn">
            Se déconnecter
          </div>
          <br />
        </div>
      </dialog>
      <span onClick={openHandler} className="header-profile">
        <img src={"./images/profile_user.svg"} alt="" />
      </span>
    </div>
  );
}
