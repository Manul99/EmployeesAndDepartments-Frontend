
const API_BASE = "http://localhost:5193/api";

// Helper to handle fetch responses
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Departments 
export const getDepartments = () => fetch(`${API_BASE}/Department/all`).then(handleResponse);
export const getDepartment = (id) => fetch(`${API_BASE}/Department/getbyID/${id}`).then(handleResponse);

export const saveDepartment = (payload) =>
  fetch(`${API_BASE}/Department/new`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(handleResponse);
export const deleteDepartment = (id) =>
  fetch(`${API_BASE}/Department/delete/${id}`, { method: "DELETE" }).then(handleResponse);


// Employees 
export const getEmployees = () => fetch(`${API_BASE}/Employee/all`).then(handleResponse);

export const getEmployee = (id) => fetch(`${API_BASE}/Employee/getbyID/${id}`).then(handleResponse);
export const saveEmployee = (payload) =>
  fetch(`${API_BASE}/Employee/new`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(handleResponse);
export const deleteEmployee = (id) =>
  fetch(`${API_BASE}/Employee/delete/${id}`, { method: "DELETE" }).then(handleResponse);
