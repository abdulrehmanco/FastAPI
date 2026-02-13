import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

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

  // Fetch the blog data to edit
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const blog = res.data;

        // Check if user is the author
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
        {error}
      </p>
    );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f8fafc",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Edit Blog</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            boxSizing: "border-box",
          }}
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            minHeight: "150px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          required
        />

        {/* Current Image Display */}
        {currentImage && (
          <div style={{ marginBottom: "15px" }}>
            <p style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#555" }}>
              Current Image:
            </p>
            <img
              src={`http://127.0.0.1:8000/${currentImage}`}
              alt="Current blog image"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            />
          </div>
        )}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "20px" }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
            fontSize: "16px",
          }}
        >
          {submitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
