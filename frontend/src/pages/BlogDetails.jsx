import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import CommentList from "../pages/Comment/CommentList";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        alert("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/blogs/${id}`);
      alert("Blog deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting blog. Make sure you're the author.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  const isAuthor = user && blog.author_id === user.id;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ flex: 1 }}>
          <h1>{blog.title}</h1>
          {blog.image && (
            <img
              src={`http://localhost:8000/${blog.image}`}
              alt={blog.title}
              style={{ width: "100%", marginBottom: "20px" }}
            />
          )}
          <p>{blog.content}</p>
          <small>Author ID: {blog.author_id}</small>
        </div>

        {/* Edit & Delete Buttons - Only show if user is the author */}
        {isAuthor && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginLeft: "20px",
              flexDirection: "column",
              minWidth: "120px",
            }}
          >
            <button
              onClick={() => navigate(`/edit-blog/${id}`)}
              style={{
                padding: "10px 15px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: "10px 15px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: deleting ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Comments & Replies Section */}
      <CommentList blogId={id} />
    </div>
  );
}
