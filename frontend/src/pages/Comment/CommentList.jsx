import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../auth/AuthContext";
import CommentForm from "./CommentForm";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";

export default function CommentList({ blogId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { user } = useContext(AuthContext);

  const fetchComments = async () => {
    try {
      const res = await api.get(`blogs/${blogId}/comments`);
      setComments(res.data);
      setRefreshCounter(c => c + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
            <p><strong>{c.username || `User ${c.user_id}`}:</strong> {c.content}</p>
            <ReplyForm commentId={c.id} refresh={fetchComments} />
            <ReplyList commentId={c.id} refreshTrigger={refreshCounter} />
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
      {user && <CommentForm blogId={blogId} refresh={fetchComments} />}
    </div>
  );
}
