import React from "react";

export default function RecordTable({ columns = [], data = [], onAdd, renderRowActions, title }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th colSpan={columns.length} className="d-flex justify-content-between align-items-center">
              <div><strong>{title}</strong></div>
              <div>
                <button className="btn add-btn" onClick={onAdd}>+ Add</button>
              </div>
            </th>
          </tr>
          <tr>
            {columns.map(c => <th key={c.key}>{c.title}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan={columns.length + 1} className="text-center small-muted">No records found</td></tr>
          )}
          {data.map(row => (
            <tr key={row.key || JSON.stringify(row)}>
              {columns.map(c => <td key={c.key + "_" + (row[c.dataIndex] ?? "")}>{c.render ? c.render(row) : (row[c.dataIndex] ?? "")}</td>)}
              <td>{renderRowActions(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
