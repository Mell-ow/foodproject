import React, { useState } from "react";

function AuthPanel({ user, onLogin, onRegister, onLogout }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await onRegister({ name, email, password });
      } else {
        await onLogin({ email, password });
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      window.alert(error?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <section className="auth-panel card">
        <p>
          Signed in as <strong>{user.name}</strong>
        </p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </section>
    );
  }

  return (
    <section className="auth-panel card">
      <h3>{isRegister ? "Create Account" : "Login"}</h3>

      <form onSubmit={submit}>
        {isRegister ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            required
          />
        ) : null}

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          required
        />

        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button type="button" className="link-btn" onClick={() => setIsRegister((prev) => !prev)}>
        {isRegister ? "Already have an account? Login" : "New here? Register"}
      </button>
    </section>
  );
}

export default AuthPanel;