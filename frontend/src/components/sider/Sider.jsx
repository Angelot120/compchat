import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../loading/LoadingIndicator";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function Sider({ handleCurrentGroup, sider }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getGroups();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/v1.0.0/get/groups", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setGroups(res.data.data[0]);
        setLoading(false);
        console.log(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Une erreur est survenue lors du chargement des données !");
      });
  }, []);

  const handleShow = (e, group, id) => {
    e.preventDefault();
    localStorage.setItem("groupId", id);
    setActiveIndex(group.id);

    handleCurrentGroup(group);

    // localStorage.setItem("groupId", id);
    // navigate(`/chat/${id}/`);
  };

  const navigate = useNavigate();

  if (!groups) {
    return <div className="sider">Aucun groupe veuillez crééer un groupe.</div>;
  }

  return (
    <div>
      <ToastContainer stacked position="bottom-left" />
      <div className={sider ? "sider" : `sider-closed`}>
        <div>
          {loading && <LoadingIndicator />}

          {groups.map((group) => (
            <div key={group.id} onClick={(e) => handleShow(e, group, group.id)}>
              <div
                className={`groups ${activeIndex === group.id ? "active" : ""}`}
              >
                {group.image ? (
                  <img
                    src={`http://127.0.0.1:8000/db/groupProfile/${group.image}`}
                    alt="image du groupe"
                    className="profile-image"
                  />
                ) : (
                  <img
                    src={"./images/profile_user.svg"}
                    alt="image du groupe"
                    className="profile-image"
                  />
                )}
                {group.name}
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
