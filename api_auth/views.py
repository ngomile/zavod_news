from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

class SignUpView(generics.CreateAPIView):
    '''
    API view for user registration.
    '''
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            'data': serializer.data,
            'message': 'User created successfully.',
            'status': 'success'
        }, status=201)

class SignInView(generics.GenericAPIView):
    '''
    API view for user authentication.
    '''
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)

            return Response({
                'message': 'User authenticated successfully.',
                'status': 'success',
                'data': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_serializer.data
                }
            }, status=200)

        return Response({
            'message': 'Invalid credentials.',
            'status': 'error'
        }, status=401)
