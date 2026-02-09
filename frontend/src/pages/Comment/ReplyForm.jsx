import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../auth/AuthContext";

export default function ReplyForm({ commentId, refresh }) {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post(`/comments/${commentId}/replies`, { content });
      setContent("");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Error posting reply");
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={submit} style={{ marginLeft: "20px", marginTop: "5px" }}>
      <input
        placeholder="Reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "60%", padding: "4px" }}
      />
      <button type="submit" style={{ marginLeft: "5px" }}>Reply</button>
    </form>
  );
}
