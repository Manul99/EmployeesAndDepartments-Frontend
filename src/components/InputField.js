import React from "react";

export default function InputField({ label, name, type="text", value, onChange, required=false, placeholder="" }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}{required && <span className="text-danger"> *</span>}</label>
      <input
        className="form-control"
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
