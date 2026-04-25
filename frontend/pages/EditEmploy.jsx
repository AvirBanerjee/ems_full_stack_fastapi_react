import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

function EditEmploy() {
  const  { id }= useParams();   // correct extraction
  const navigate = useNavigate();

  // initialized structure to avoid null crash
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    experience: 0,
    completed: 0,
    description: "",
    isOnProject: false
  });

  const [loading, setLoading] = useState(true);

  // fetch employee data
  useEffect(() => {
    API.get(`/employ/${id}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/employ/${id}`, form);
      navigate('/employs');
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Full Name"
          value={form.fullname}
          onChange={e =>
            setForm({ ...form, fullname: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Experience"
          value={form.experience}
          onChange={e =>
            setForm({ ...form, experience: Number(e.target.value) })
          }
        />

        <input
          type="number"
          placeholder="Completed Projects"
          value={form.completed}
          onChange={e =>
            setForm({ ...form, completed: Number(e.target.value) })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label>
          On Project:
          <input
            type="checkbox"
            checked={form.isOnProject}
            onChange={e =>
              setForm({ ...form, isOnProject: e.target.checked })
            }
          />
        </label>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditEmploy;