import React, { useEffect, useState } from "react";
import RecordTable from "../components/RecordTable";
import InputField from "../components/InputField";
import { getDepartments, saveDepartment, deleteDepartment } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function DepartmentsPage(){
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ varDepartmentCode: "", varDepartmentName: "", numDepatmentId: 0 });
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Initial data load
  useEffect(() => {
  const fetchData = async () => {
    await load();
  };
  fetchData();
}, []);

// Load departments from API
  async function load(){
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments((data || []).map(d => ({
        key: d.numDepatmentId ?? d.departmentId ?? d.DepartmentId,
        numDepatmentId: d.numDepatmentId ?? d.departmentId ?? d.DepartmentId,
        varDepartmentCode: d.varDepartmentCode ?? d.departmentCode ?? d.DepartmentCode,
        varDepartmentName: d.varDepartmentName ?? d.departmentName ?? d.DepartmentName,
        dteCreatedAt: d.dteCreatedAt
      })));
    } catch (ex) {
      console.error(ex);
      setDepartments([]);
    } finally { setLoading(false); }
  }

  // Add new department
  function onAddClick(){
    setEditingId(null);
    setForm({ varDepartmentCode: "", varDepartmentName: "", numDepatmentId: 0 });
    setShowForm(true);
    setError("");
  }

  // Edit department
  function onEdit(row){
    setEditingId(row.numDepatmentId);
    setForm({ varDepartmentCode: row.varDepartmentCode, varDepartmentName: row.varDepartmentName, numDepatmentId: row.numDepatmentId });
    setShowForm(true);
    setError("");
  }

  // Delete department
  async function onDelete(row){
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(row.numDepatmentId);
      await load();
    } catch (ex) {
      alert("Delete failed: " + ex.message);
    }
  }

  // Handle form field changes
  function handleChange(e){
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Form submission
  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    if (!form.varDepartmentCode?.trim() || !form.varDepartmentName?.trim()){
      setError("Both code and name are required.");
      return;
    }
    try {
      
      const payload = {
        numDepatmentId: editingId ?? 0,
        varDepartmentCode: form.varDepartmentCode.trim(),
        varDepartmentName: form.varDepartmentName.trim()
      };
      const res = await saveDepartment(payload);
    
      if(res.data === 1){
        ;
        toast.success(res.message);
      }
      if(res.data === 2){
        toast.success(res.message);
      }
     
      await load();
      setShowForm(false);
    } catch (ex) {
      setError("Save failed: " + ex.message);
    }
  }

    // Pagination controls
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = departments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(departments.length / pageSize);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Table columns definition
  const columns = [
    { key: "code", title: "Code", dataIndex: "varDepartmentCode" },
    { key: "name", title: "Name", dataIndex: "varDepartmentName" },
    { key: "created", title: "Created", dataIndex: "dteCreatedAt", render: r => r.dteCreatedAt ? new Date(r.dteCreatedAt).toISOString().slice(0,10) : "" }
  ];

  return (
    <div className="page-card">
      <ToastContainer position="top-right" />
      <h3 className="mb-3">Departments</h3>

        {!showForm && (
        <>
          <RecordTable
            title="Departments"
            columns={columns}
            data={currentRecords}
            onAdd={onAddClick}
            renderRowActions={(row) => (
              <>
                <button className="btn btn-sm edit-btn me-2" onClick={() => onEdit(row)}>Edit</button>
                <button className="btn btn-sm delete-btn" onClick={() => onDelete(row)}>Delete</button>
              </>
            )}
          />
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <div className="form-card p-3 mb-3">
          <h5>{editingId ? "Edit Department" : "Add Department"}</h5>
          {error && <div className="alert alert-danger py-1">{error}</div>}

          <form onSubmit={handleSubmit}>
            <InputField label="Department Code" name="varDepartmentCode" value={form.varDepartmentCode} onChange={handleChange} required />
            <InputField label="Department Name" name="varDepartmentName" value={form.varDepartmentName} onChange={handleChange} required />
            <div className="d-flex gap-2">
              <button className="btn add-btn" type="submit">{editingId ? "Update" : "Save"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showForm ? null : <div className="small-muted">Tip: Click the green <strong>+ Add</strong> button to create a new department.</div>}
    </div>
  );
}
