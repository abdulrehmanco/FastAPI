import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-link" style={{ fontSize: "1.3em", fontWeight: "700" }}>
          📚 Blogs
        </Link>
      </div>
      <div className="navbar-links">
        {user && (
          <Link to="/create-blog" className="navbar-link">
            ✍️ Create
          </Link>
        )}
      </div>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">👤 {user.username}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
