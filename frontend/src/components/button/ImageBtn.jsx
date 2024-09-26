import React from "react";

export default function ImageBtn({ text, onClick, type, disabled, className }) {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {/* {text || "Opérations"} */}
        <img src={"./images/profile_user.svg"} alt="" />
      </button>
    </div>
  );
}
