import React, { useEffect, useState } from "react";
import Menu from "../components/menu/Menu";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loading/LoadingIndicator";
import Sider from "../components/sider/Sider";
import Chat from "./Chat/Chat";

export default function Dashboard() {
  const [isSiderVisible, setSiderVisible] = useState(true);
  const [currentGroup, setCurrentGroup] = useState(true);
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  const handleCurrentGroup = (data) => {
    setCurrentGroup(data);
  };

  const getSiderState = () => {
    setSiderVisible(!isSiderVisible);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsValid(token);
  }, []);

  if (!isValid) {
    navigate("/");
    toast.error("Veuillez vous connecter !");
  }

  const fechData = () => {
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
  };

  return (
    <div className="all-chat-session">
      <ToastContainer />
      <Menu getGroups={fechData} getSiderState={getSiderState} />
      <br />
      <div className="container">
        <Sider handleCurrentGroup={handleCurrentGroup} sider={isSiderVisible} />

        <div
          className="main-content"
          style={{ marginLeft: isSiderVisible ? "300px" : "0" }}
        >
          <Chat group={currentGroup} />
        </div>
      </div>
    </div>
  );
}
