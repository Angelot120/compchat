import React, { useEffect, useState } from "react";
import Menu from "../components/menu/Menu";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loading/LoadingIndicator";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const navigate = useNavigate();

  const handleShow = (e, id) => {
    e.preventDefault();

    navigate(`/chat/${id}/`);
    localStorage.setItem("id", id);
  };

  return (
    <div>
      <Menu />

      <div>
        {loading && <LoadingIndicator />}

        {groups.map((group) => (
          <div key={group.id} onClick={(e) => handleShow(e, group.id)}>
            {group.name}
          </div>
        ))}
      </div>
    </div>
  );
}
