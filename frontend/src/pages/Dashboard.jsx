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

  return (
    <div className="all-chat-session">
      <ToastContainer />
      <Menu getSiderState={getSiderState} />
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
