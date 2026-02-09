import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { username, password, email });
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
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
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>Signup</h2>

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
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        Signup
      </button>
    </form>
  );
}
