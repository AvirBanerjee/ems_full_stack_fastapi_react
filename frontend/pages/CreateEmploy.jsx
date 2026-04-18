import { useState } from "react";
import API from "../api/axios";
function CreateEmploy() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    isOnProject: false,
    experience: 0,
    completed: 0,
    description: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/employ", form);
    alert("Created");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, fullname: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="number"
        onChange={(e) => setForm({ ...form, experience: +e.target.value })}
      />
      <input
        type="number"
        onChange={(e) => setForm({ ...form, completed: +e.target.value })}
      />
      <textarea
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <label>
        On Project
        <input
          type="checkbox"
          onChange={(e) => setForm({ ...form, isOnProject: e.target.checked })}
        />
      </label>
      <button>Create</button>
    </form>
  );
}
export default CreateEmploy;
