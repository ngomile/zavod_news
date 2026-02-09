import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Article, Reaction, Comment

logger = logging.getLogger(__name__)

class ReactionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.article_id = self.scope['url_route']['kwargs']['article_id']
        self.group_name = f'article_{self.article_id}'
        
        # LOG: Connection attempt
        print(f"[WS CONNECT] Article: {self.article_id} | User: {self.scope['user']}")
        
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"[WS ACCEPTED] Joined group: {self.group_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        reaction_type = data.get('reaction')
        user = self.scope['user']
        
        print(f"[WS RECEIVE] Reaction: {reaction_type} from User: {user}")

        if user.is_authenticated:
            result = await self.update_reaction(reaction_type, user)
            print(f"[WS DB UPDATE] New Counts -> Likes: {result['likes']}, Dislikes: {result['dislikes']}")
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'reaction_broadcast',
                    'likes': result['likes'],
                    'dislikes': result['dislikes'],
                    'actor_id': user.id,
                    'action_type': reaction_type,
                    'new_state': result['new_state'] 
                }
            )
        else:
            print("[WS AUTH ERROR] Unauthenticated user tried to send a reaction.")

    @database_sync_to_async
    def update_reaction(self, reaction_type, user):
        article = Article.objects.get(id=self.article_id)
        existing = Reaction.objects.filter(user=user, article=article).first()
        
        if existing and existing.type == reaction_type:
            existing.delete()
            new_state = None
        else:
            Reaction.objects.update_or_create(
                user=user, article=article,
                defaults={'type': reaction_type}
            )
            new_state = reaction_type


        return {
            'likes': article.get_reaction_count('like'),
            'dislikes': article.get_reaction_count('dislike'),
            'new_state': new_state
        }

    async def reaction_broadcast(self, event):
        print(f"[WS BROADCAST] Sending updates to group {self.group_name}")
        await self.send(text_data=json.dumps({
            'likes': event['likes'],
            'dislikes': event['dislikes'],
            'actor_id': event['actor_id'],
            'current_user_reaction': event['new_state']
        }))

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.article_id = self.scope['url_route']['kwargs']['article_id']
        self.group_name = f'comments_{self.article_id}'

        # Join the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        comment_text = data.get('comment')
        user = self.scope['user']

        if user.is_authenticated and comment_text:
            new_comment = await self.save_comment(comment_text, user)

            # Relay new comment to all group members 
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'comment_broadcast',
                    'comment_data': {
                        'id': new_comment.id,
                        'username': user.username,
                        'content': new_comment.content,
                        'created_at': new_comment.created_at.isoformat()
                    }
                }
            )

    async def comment_broadcast(self, event):
        comment_data = event['comment_data']

        await self.send(text_data=json.dumps({
            'comment': comment_data
        }))

    @database_sync_to_async
    def save_comment(self, text, user):
        article = Article.objects.get(id=self.article_id)
        return Comment.objects.create(
            article=article,
            user=user,
            content=text
        )