import React from "react";

export function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
      <button className="btn btn-sm me-2 edit-btn" onClick={onEdit}>Edit</button>
      <button className="btn btn-sm delete-btn" onClick={onDelete}>Delete</button>
    </>
  );
}
