import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Comment } from '@/types';
import LoginRequiredToCommentDialog from './login-required-to-comment-dialog';
import { getAuthToken, getUser } from '@/app/auth/actions';

const CommentSection = ({ articleId, initialComments }: { 
  articleId: number, 
  initialComments: Comment[], 
}) => {
  const user = getUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket;
    let wsurl: string;
    
    // Connect to the CommentConsumer
    if (user) {
        const token = getAuthToken();
        wsurl = `ws://localhost:8000/ws/news/${articleId}/comments/?token=${token}`;
    } else {
        wsurl = `ws://localhost:8000/ws/news/${articleId}/comments/`;
    }
    
    socket = new WebSocket(wsurl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Newest comments at the top
      setComments((prev) => [data.comment, ...prev]);
    };

    socketRef.current = socket;
    return () => socket.close();
  }, [articleId]);

  const handleSend = () => {
    if (newComment.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 'comment': newComment }));
      setNewComment(''); // Clear input
    }
  };

  return (
    <div className="w-full max-w-2xl mt-10 p-4 border-t">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      <div className="flex gap-2 mb-8">
        {user ? (
          <>
            <Input 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>Post</Button>
          </>
        ) : (
          <>
            <Input 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <LoginRequiredToCommentDialog />
          </>
        )}
      </div>

      {/* 2. LIVE LIST */}
      <div className="space-y-4">
        {comments.map((c, i) => (
          <div key={c.id || i} className="p-3 bg-white border rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm text-blue-600">@{c.username}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;