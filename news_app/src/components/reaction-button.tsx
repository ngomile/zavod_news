import { useState, useEffect, useRef } from 'react';
import LoginRequiredToReactDialog from '@/components/login-required-to-react-dialog';
import type { Article } from '@/types';
import { getAuthToken, getUser } from '@/app/auth/actions';

const ReactionButtons = ({ articleId, initialData }: { 
  articleId: number; 
  initialData: Article; // Data passed from the NewsItemTile fetch
}) => {
  console.log(`Initial reaction data: ${JSON.stringify(initialData)}`);
  const user = getUser();
  const [counts, setCounts] = useState({
    likes: initialData.likes_count || 0,
    dislikes: initialData.dislikes_count || 0,
  });

  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    initialData.user_reaction || null
  );
  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket;
    
    if (user) {
      let token = getAuthToken();
      console.log(`Token: ${token}, User: ${JSON.stringify(user)}`);
      socket = new WebSocket(`ws://127.0.0.1:8000/ws/news/${articleId}/reactions/?token=${token}`);
    } else {
      socket = new WebSocket(`ws://127.0.0.1:8000/ws/news/${articleId}/reactions/`);
    }

    socket.onopen = () => {
      console.log(`[WS OPEN] Successfully connected to Article ${articleId}`);
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Backend should broadcast: { likes: 10, dislikes: 2, actor_id: 5, action: 'like' }
      console.log("[WS MESSAGE RECEIVED]", data);
      setCounts({ likes: data.likes, dislikes: data.dislikes });
      
      // If the broadcasted update was triggered by THIS user, update their active button state
      if (data.actor_id === user?.id) {
        setUserReaction(data.current_user_reaction); 
      }
    };

    socket.onerror = (error) => {
      console.error("[WS ERROR] Socket encountered an error:", error);
    };

    socket.onclose = (event) => {
      console.warn(`[WS CLOSED] Code: ${event.code}, Reason: ${event.reason}`);
    };

    socketRef.current = socket;
    return () => socket.close();
  }, [articleId, user]);

  const handleSendReaction = (type: 'like' | 'dislike') => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ reaction: type }));
    }
  };

  const handleSendLike = () => {
    handleSendReaction("like");
  };

  const handleSendDislike = () => {
    handleSendReaction("dislike");
  };

  // If logged in, show the interactive buttons
  return (
    <div className="flex flex-row flex-nowrap">
        { user ? (
            <>
            <button
                className={ `${userReaction == 'like' ? 'text-gray-100 bg-gray-700 hover:bg-gray-500' : 'text-gray-700 bg-gray-200 hover:bg-gray-100'} rounded-l-full flex flex-row gap-1 flex-nowrap justify-start items-center border-r border-white px-2`}
                type="button"
                onClick={ handleSendLike }>
                <span>{ counts.likes }</span>
                <span>{ counts.likes == 1 ? 'Like' : 'Likes'}</span>
            </button>
            <button
                className={ `${userReaction == 'dislike' ? 'text-gray-100 bg-gray-700 hover:bg-gray-500' : 'text-gray-700 bg-gray-200 hover:bg-gray-100'} rounded-r-full flex flex-row gap-1 flex-nowrap justify-start items-center border-l border-white px-2` }
                type="button"
                onClick={ handleSendDislike }>
                <span>{ counts.dislikes }</span>
                <span>{ counts.dislikes == 1 ? 'Dislike' : 'Dislikes' }</span>
            </button>
            </>
        ) : (
            <>
            <LoginRequiredToReactDialog
                userReaction="like"
                count={ counts.likes }
                />
            <LoginRequiredToReactDialog
                userReaction="dislike"
                count={ counts.dislikes }/>
            </>
        )}
    </div>
  );
};

export default ReactionButtons;
