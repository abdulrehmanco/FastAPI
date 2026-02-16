import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import "../styles.css";

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
    e.stopPropagation();

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
    e.stopPropagation();
    navigate(`/edit-blog/${blogId}`);
  };

  return (
    <div className="blogs-container">
      <h2 className="blogs-header">📚 All Blogs</h2>
      <div className="blogs-list">
        {blogs.map((b) => {
          const isAuthor = user && b.author_id === user.id;
          return (
            <div
              key={b.id}
              className="blog-card"
              onClick={() => navigate(`/blogs/${b.id}`)}
            >
              {b.image && (
                <img
                  src={`http://localhost:8000/${b.image}`}
                  alt={b.title}
                  className="blog-card-image"
                />
              )}

              <div className="blog-card-content">
                <h3 className="blog-card-title">{b.title}</h3>
                <p className="blog-card-author">By {b.author_name || "Unknown"}</p>
                <p className="blog-card-excerpt">{b.content}</p>
                
                {isAuthor && (
                  <div className="blog-card-actions">
                    <button
                      className="btn-small btn-edit"
                      onClick={(e) => handleEditClick(b.id, e)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={(e) => handleDelete(b.id, e)}
                      disabled={deletingId === b.id}
                    >
                      {deletingId === b.id ? "🗑️ Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
