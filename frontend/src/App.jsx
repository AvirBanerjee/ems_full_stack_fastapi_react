import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Employs from "../pages/Employs";

import CreateEmploy from "../pages/CreateEmploy";
import EmployDetails from "../pages/EmployDetails";
import EditEmploy from "../pages/EditEmploy";
import ProtectedRoute from "../auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employs"
          element={
            <ProtectedRoute>
              <Employs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateEmploy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employ/:id"
          element={
            <ProtectedRoute>
              <EmployDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditEmploy />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
