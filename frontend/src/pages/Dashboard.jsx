import React, { useEffect, useState } from "react";
import Menu from "../components/menu/Menu";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/loading/LoadingIndicator";
import Sider from "../components/sider/Sider";
import Chat from "./Chat/Chat";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isSiderVisible, setSiderVisible] = useState(true);
  const [currentGroup, setCurrentGroup] = useState(true);
  const [isValid, setIsValid] = useState(null);

  const handleCurrentGroup = (data) => {
    setCurrentGroup(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsValid(token);
  }, []);

  if (!isValid) {
    navigate("/");
  }

  return (
    <div className="all-chat-session">
      <Menu />
      <br />
      <div className="container">
        {isSiderVisible && <Sider handleCurrentGroup={handleCurrentGroup} />}

        <div
          className="main-content"
          style={{ marginLeft: isSiderVisible ? "200px" : "0" }}
        >
          <Chat group={currentGroup} />
        </div>
      </div>
    </div>
  );
}
