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
        <img src={"./icons/send.png"} alt="" className="send-btn-img" />
      </button>
    </div>
  );
}
