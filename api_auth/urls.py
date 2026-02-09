from django.urls import path
from .views import SignInView, SignUpView

urlpatterns = [
    path('register/', SignUpView.as_view(), name='register'),
    path('login/', SignInView.as_view(), name='login'),
]
