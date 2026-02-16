import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ReplyList({ commentId, refreshTrigger }) {
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
  }, [commentId, refreshTrigger]);

  if (!replies.length) return null;

  return (
    <div style={{ marginLeft: "20px", marginTop: "5px", paddingLeft: "10px", borderLeft: "3px solid #e5e7eb" }}>
      {replies.map((r) => (
        <p key={r.id} style={{ margin: "5px 0" }}>
          <b>{r.username || `User ${r.user_id}`}</b>: {r.content}
        </p>
      ))}
    </div>
  );
}
