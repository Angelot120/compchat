import React, { useState } from "react";

export default function Button({ text, onClick, type, disabled, className }) {
  return (
    <div>
      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {text || "Opérations"}
      </button>
    </div>
  );
}
