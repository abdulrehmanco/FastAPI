import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#1e293b", // nice dark blue
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginRight: "15px",
    fontWeight: "500",
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#ef4444", // red logout button
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  };

  const userStyle = {
    marginRight: "15px",
    fontWeight: "500",
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle}>
          Blogs
        </Link>
      </div>

      <div>
        {user ? (
          <>
            <span style={userStyle}>👤 {user.username}</span>
            <Link to="/create-blog" style={linkStyle}>
              Create
            </Link>
            <button style={buttonStyle} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/signup" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
