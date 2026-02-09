import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ReplyList({ commentId }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await api.get(`/comments/${commentId}/replies`);
        setReplies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReplies();
  }, [commentId]);

  if (!replies.length) return null;

  return (
    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
      {replies.map((r) => (
        <p key={r.id}><b>User {r.user_id}</b>: {r.content}</p>
      ))}
    </div>
  );
}
