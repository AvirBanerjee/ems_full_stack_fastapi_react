import React, { useState } from 'react';
import { login } from '../auth/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="E-Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>

      {/* 👇 Register Navigation Option */}
      <p>
        Don't have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>

      {/* OR button-based navigation */}
      <button onClick={() => navigate('/register')}>
        Go to Register
      </button>
    </div>
  );
}

export default Login;