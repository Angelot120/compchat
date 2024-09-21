import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import AddMember from "../../components/dialogueBox/AddMember";

export default function Chat() {
  const id = localStorage.getItem("id");
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/v1.0.0/get/groups/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setGroup(res.data.data[0]);
        setLoading(false);
        console.log(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Une erreur est survenue lors du chargement des données !");
      });
  }, []);

  return (
    <div>
      {/* {id ? id : "Null"} */}
      {/* <button>Inviter un membre + </button> */}
      <AddMember id={group.id} />
      <img src={group.image} alt="profile" />
      <p> {group.name}</p>
      {loading && <LoadingIndicator />}
    </div>
  );
}
