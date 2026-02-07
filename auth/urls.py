from django.urls import path
from .views import SignInView, SignUpView

url_patterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
]
