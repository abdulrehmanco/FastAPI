import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/blogs")
      .then((res) => setBlogs(res.data))
      .catch(() => alert("Login required"));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>All Blogs</h2>
      {blogs.map((b) => (
        <div
          key={b.id}
          onClick={() => navigate(`/blogs/${b.id}`)}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {/* Thumbnail */}
          {b.image && (
            <img
              src={`http://localhost:8000/${b.image}`}
              alt={b.title}
              style={{ width: "100px", height: "70px", objectFit: "cover" }}
            />
          )}

          <div>
            <h3>{b.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {b.content.length > 100 ? b.content.slice(0, 100) + "..." : b.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
