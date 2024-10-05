import React from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  type,
  label,
  reference,
  className,
  inputClassName,
}) {
  return (
    <div className={className}>
      <label htmlFor={reference}>{label}</label>
      <br />
      <br />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        id={reference}
        className={inputClassName}
      />
    </div>
  );
}
