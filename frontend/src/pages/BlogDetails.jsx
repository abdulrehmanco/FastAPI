import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import CommentList from "../pages/Comment/CommentList";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h1>{blog.title}</h1>
      {blog.image && (
        <img
          src={`http://127.0.0.1:8000/${blog.image}`}
          alt={blog.title}
          style={{ width: "100%", marginBottom: "20px" }}
        />
      )}
      <p>{blog.content}</p>
      <small>Author ID: {blog.author_id}</small>

      {/* Comments & Replies Section */}
      <CommentList blogId={id} />
    </div>
  );
}
