import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EmployCard from "../components/EmployCard";
import API from "../api/axios";

function Employs() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/employs");
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      await API.delete(`/employ/${id}`);
      setData(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <Navbar />

      {data.length === 0 ? (
        <p>No Employees Found</p>
      ) : (
        data.map(emp => (
          <EmployCard
            key={emp.id}
            emp={emp}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default Employs;