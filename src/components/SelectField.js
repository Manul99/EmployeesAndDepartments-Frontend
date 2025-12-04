import React from "react";

export default function SelectField({ label, name, value, onChange, options=[], required=false }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}{required && <span className="text-danger"> *</span>}</label>
      <select className="form-select" name={name} value={value ?? ""} onChange={onChange}>
        <option value={0}>Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
