import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api.get("/blogs")
      .then((res) => setBlogs(res.data))
      .catch(() => alert("Login required"));
  }, []);

  const handleDelete = async (blogId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setDeletingId(blogId);
    try {
      await api.delete(`/blogs/${blogId}`);
      setBlogs(blogs.filter((b) => b.id !== blogId));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting blog. Make sure you're the author.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (blogId, e) => {
    e.stopPropagation(); // Prevent navigation to blog details
    navigate(`/edit-blog/${blogId}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>All Blogs</h2>
      {blogs.map((b) => {
        const isAuthor = user && b.author_id === user.id;
        return (
          <div
            key={b.id}
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
                onClick={() => navigate(`/blogs/${b.id}`)}
              />
            )}

            {/* Blog Content */}
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => navigate(`/blogs/${b.id}`)}
            >
              <h3>{b.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {b.content.length > 100 ? b.content.slice(0, 100) + "..." : b.content}
              </p>
            </div>

            {/* Edit & Delete Buttons - Only for Author */}
            {isAuthor && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                }}
              >
                <button
                  onClick={(e) => handleEditClick(b.id, e)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(b.id, e)}
                  disabled={deletingId === b.id}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: deletingId === b.id ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    opacity: deletingId === b.id ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {deletingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
