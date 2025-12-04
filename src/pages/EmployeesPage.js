import React, { useEffect, useState } from "react";
import RecordTable from "../components/RecordTable";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { getEmployees, saveEmployee, deleteEmployee, getDepartments } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function EmployeesPage(){
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    numEmployeeId: 0,
    varFirstName: "",
    varLastName: "",
    varEmail: "",
    dteDateOfBirth: "",
    numSalary: "",
    numDepatmentId:0
  });
  const [error, setError] = useState("");

  useEffect(()=> { load(); loadDeps(); }, []);

  async function load(){
    try {
      const data = await getEmployees();
      setEmployees((data || []).map(e => ({
        key: e.numEmployeeId ?? e.employeeId ?? e.EmployeeId,
        numEmployeeId: e.numEmployeeId ?? e.employeeId ?? e.EmployeeId,
        varFirstName: e.varFirstName ?? e.firstName ?? e.FirstName,
        varLastName: e.varLastName ?? e.lastName ?? e.LastName,
        varEmail: e.varEmail ?? e.email ?? e.Email,
        dteDateOfBirth: e.dteDateOfBirth ?? e.dateOfBirth ?? e.DateOfBirth,
        numAge: e.numAge ?? e.age ?? null,
        numSalary: e.numSalary ?? e.salary ?? null,
        numDepatmentId: e.numDepatmentId ?? e.departmentId ?? e.DepartmentId
      })));
    } catch (ex) {
      console.error(ex);
      setEmployees([]);
    }
  }

async function loadDeps(){
  try {
    const ds = await getDepartments();
    setDepartments((ds || []).map(d => ({
      value: String(d.numDepatmentId), 
      label: d.varDepartmentName
    })));
  } catch {
    setDepartments([]);
  }
}


  function onAddClick(){
    setEditingId(null);
    setForm({ numEmployeeId:0, varFirstName:"", varLastName:"", varEmail:"", dteDateOfBirth:"", numSalary:"", numDepatmentId:"" });
    setShowForm(true);
    setError("");
  }

  function onEdit(row){
    setEditingId(row.numEmployeeId);
    setForm({
      numEmployeeId: row.numEmployeeId,
      varFirstName: row.varFirstName,
      varLastName: row.varLastName,
      varEmail: row.varEmail,
      dteDateOfBirth: row.dteDateOfBirth ? new Date(row.dteDateOfBirth).toISOString().slice(0,10) : "",
      numSalary: row.numSalary ?? "",
      numDepatmentId: row.numDepatmentId ?? ""
    });
    setShowForm(true);
  }

  async function onDelete(row){
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(row.numEmployeeId);
      await load();
    } catch (ex) {
      alert("Delete failed: " + ex.message);
    }
  }

  function handleChange(e){
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function calcAgeFromDob(dobIso){
    if (!dobIso) return "";
    const dob = new Date(dobIso);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    if (!form.varFirstName.trim() || !form.varLastName.trim() || !form.varEmail.trim() || !form.dteDateOfBirth || !form.numDepatmentId){
      setError("Fill required fields: First name, last name, email, DOB and department.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.varEmail)){
      setError("Invalid email.");
      return;
    }
    try {
      const payload = {
        numEmployeeId: editingId ?? 0,
        varFirstName: form.varFirstName.trim(),
        varLastName: form.varLastName.trim(),
        varEmail: form.varEmail.trim(),
        dteDateOfBirth: form.dteDateOfBirth,
        numAge: calcAgeFromDob(form.dteDateOfBirth) || 0,
        numSalary: Number(form.numSalary || 0),
        numDepatmentId: Number(form.numDepatmentId)
      };
      const res = await saveEmployee(payload);
       if(res.data === 1){
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

  const columns = [
    { key: "name", title: "Name", dataIndex: "varFirstName", render: r => `${r.varFirstName} ${r.varLastName}` },
    { key: "email", title: "Email", dataIndex: "varEmail" },
    { key: "dob", title: "DOB", dataIndex: "dteDateOfBirth", render: r => r.dteDateOfBirth ? new Date(r.dteDateOfBirth).toLocaleDateString() : "" },
    { key: "age", title: "Age", dataIndex: "numAge" },
    { key: "salary", title: "Salary", dataIndex: "numSalary" },
    { key: "dept", title: "Department", dataIndex: "numDepatmentId", render: r => {
        const dep = departments.find(d => String(d.value) === String(r.numDepatmentId));
        return dep ? dep.label : "";
    }}
  ];

  return (
    <div className="page-card">
      <ToastContainer position="top-right" />
      <h3 className="mb-3">Employees</h3>

      {!showForm && (
        <RecordTable
          title="Employees"
          columns={columns}
          data={employees}
          onAdd={onAddClick}
          renderRowActions={(row)=> (
            <>
              <button className="btn btn-sm edit-btn me-2" onClick={()=> onEdit(row)}>Edit</button>
              <button className="btn btn-sm delete-btn" onClick={()=> onDelete(row)}>Delete</button>
            </>
          )}
        />
      )}

      {showForm && (
        <div className="form-card p-3 mb-3">
          <h5>{editingId ? "Edit Employee" : "Add Employee"}</h5>
          {error && <div className="alert alert-danger py-1">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <InputField label="First Name" name="varFirstName" value={form.varFirstName} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <InputField label="Last Name" name="varLastName" value={form.varLastName} onChange={handleChange} required />
              </div>
            </div>

            <InputField label="Email" name="varEmail" type="email" value={form.varEmail} onChange={handleChange} required />
            <div className="row">
              <div className="col-md-4">
                <InputField label="Date of Birth" name="dteDateOfBirth" type="date" value={form.dteDateOfBirth} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <div className="form-control">{calcAgeFromDob(form.dteDateOfBirth)}</div>
                </div>
              </div>
              <div className="col-md-6">
                <InputField label="Salary" name="numSalary" type="number" value={form.numSalary} onChange={handleChange} />
              </div>
            </div>

            <SelectField label="Department" name="numDepatmentId" value={form.numDepatmentId} onChange={handleChange} options={departments} required />

            <div className="d-flex gap-2">
              <button className="btn add-btn" type="submit">{editingId ? "Update" : "Save"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!showForm && <div className="small-muted">Tip: Click the green <strong>+ Add</strong> button to create a new employee.</div>}
    </div>
  );
}
