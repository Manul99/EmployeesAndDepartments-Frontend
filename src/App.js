
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container my-4">
        <Routes>
          <Route path='/' element={<DepartmentsPage />} />
          <Route path='/departments' element={<DepartmentsPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
