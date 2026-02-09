import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          fontSize: "16px",
        }}
        required
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          fontSize: "16px",
        }}
        required
      />

      <button
        type="submit"
        style={{
          padding: "12px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Login
      </button>
    </form>
  );
}
