import React, { useEffect, useState } from "react";
import AddGroup from "../dialogueBox/AddGroup";
import Profile from "../dialogueBox/Profile";
import axios from "axios";

export default function Menu({ getSiderState }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    getSiderState(isSidebarOpen);
  };

  return (
    <div className="header">
      <header>
        <ul>
          <li>
            <button onClick={toggleSidebar}>
              {isSidebarOpen ? "Afficher" : "Cacher"} les groupes
            </button>
          </li>

          <li>
            <div className="right-items">
              <AddGroup />
              <Profile />
            </div>
          </li>
        </ul>
      </header>
    </div>
  );
}
