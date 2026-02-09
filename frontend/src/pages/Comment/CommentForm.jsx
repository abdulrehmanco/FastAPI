import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../auth/AuthContext";

export default function CommentForm({ blogId, refresh }) {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post(`blogs/${blogId}/comments/`, { content });
      setContent("");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Error posting comment");
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={submit} style={{ marginTop: "20px" }}>
      <input
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "70%", padding: "5px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>Post</button>
    </form>
  );
}
