import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Register({ user, onRegister }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const success = await onRegister({ name, email, password });
      if (success) {
        navigate("/");
      }
    } catch {
      // handled at higher level
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page card narrow-card">
      <h2>Register</h2>
      <p className="muted-text">Create your account to start ordering.</p>

      <form onSubmit={submit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="muted-text">
        Already have account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
