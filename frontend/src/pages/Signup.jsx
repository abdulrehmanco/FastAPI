import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/signup", { username, password, email });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-container">
      <h2 className="form-title">🚀 Sign Up</h2>

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

      {success && (
        <div style={{
          padding: "12px",
          marginBottom: "15px",
          background: "rgba(129, 199, 132, 0.1)",
          border: "1px solid rgba(129, 199, 132, 0.3)",
          borderRadius: "6px",
          color: "#a5d6a7"
        }}>
          {success}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className="form-input"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="Create a password"
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
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", marginTop: "20px" }}>
        Already have an account? <a href="/login" style={{ color: "#64b5f6", textDecoration: "none" }}>Login</a>
      </p>
    </form>
  );
}
