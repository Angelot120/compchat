import React from "react";
import AddGroup from "../dialogueBox/AddGroup";

export default function Menu() {
  return (
    <div className="header">
      <header>
        <ul>
          <li>
            <button>Hide Sidebar</button>
          </li>
          <li>
            <div className="right-items">
              <AddGroup />
              <img src={"./images/profile_user.svg"} alt="" />
            </div>
          </li>
        </ul>
      </header>
    </div>
  );
}
