import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles.css";

export default function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const blog = res.data;

        if (user && blog.author_id !== user.id) {
          setError("You can only edit your own blogs");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setCurrentImage(blog.image);
      } catch (err) {
        console.error(err);
        setError("Blog not found");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlog();
    }
  }, [id, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await api.put(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error updating blog. Make sure you're the author.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="form-container">
      <h2 className="form-title">✏️ Edit Blog</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="Update blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="form-textarea"
            placeholder="Update your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {currentImage && (
          <div className="form-group">
            <label className="form-label">Current Image</label>
            <img
              src={`http://localhost:8000/${currentImage}`}
              alt="Current blog"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Change Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{
              padding: "12px",
              border: "1px solid rgba(100, 108, 255, 0.15)",
              borderRadius: "8px",
              background: "rgba(100, 108, 255, 0.05)",
              color: "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
            }}
          />
        </div>

        <button
          type="submit"
          className="form-submit"
          disabled={submitting}
        >
          {submitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
