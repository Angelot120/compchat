import React from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  type,
  label,
  reference,
}) {
  return (
    <div>
      <label htmlFor={reference}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        id={reference}
      />
    </div>
  );
}
