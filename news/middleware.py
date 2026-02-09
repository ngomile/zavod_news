import logging
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
# Import JWT utilities
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()
logger = logging.getLogger(__name__)

@database_sync_to_async
def get_user_from_jwt(token_key):
    try:
        # 1. Decode and validate the JWT
        token = AccessToken(token_key)
        
        # 2. Get the user_id from the payload (default is 'user_id')
        user_id = token['user_id']
        
        # 3. Fetch the user
        user = User.objects.get(id=user_id)
        logger.info(f"[JWT AUTH] Token found for user: {user.username}")
        return user
    except Exception as e:
        logger.warning(f"[JWT AUTH ERROR] Failed to decode token: {str(e)}")
        return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token_key = query_params.get("token", [None])[0]

        if token_key:
            # Use our new JWT decoder
            scope['user'] = await get_user_from_jwt(token_key)
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)