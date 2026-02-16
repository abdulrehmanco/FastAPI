import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-container">
      <h2 className="form-title">🔐 Login</h2>

      {error && (
        <div style={{
          padding: "12px",
          marginBottom: "15px",
          background: "rgba(255, 107, 107, 0.1)",
          border: "1px solid rgba(255, 107, 107, 0.3)",
          borderRadius: "6px",
          color: "#ff8787"
        }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className="form-input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="form-submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", marginTop: "20px" }}>
        Don't have an account? <a href="/signup" style={{ color: "#64b5f6", textDecoration: "none" }}>Sign up</a>
      </p>
    </form>
  );
}
