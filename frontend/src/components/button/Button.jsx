import React, { useState } from "react";

export default function Button({ text, onClick, type, disabled }) {
  return (
    <div>
      <button
        type={type}
        className="button"
        onClick={onClick}
        disabled={disabled}
      >
        {text || "Opérations"}
      </button>
    </div>
  );
}
