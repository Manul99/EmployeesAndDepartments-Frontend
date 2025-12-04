import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(90deg,#0ea5b5,#6366f1)" }}>
      <div className="container">
        <Link className="navbar-brand header-brand" to="/">Employees & Departments</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/departments">Departments</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/employees">Employees</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
