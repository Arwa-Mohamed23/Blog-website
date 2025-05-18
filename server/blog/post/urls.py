from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # Authentication endpoints
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.CustomAuthToken.as_view(), name='login'),
    
    # User and profile endpoints
    path('api/user/', views.UserDetailView.as_view(), name='user-detail'),
    path('api/profile/', views.ProfileDetailView.as_view(), name='profile-detail'),
    
    # Post endpoints
    path('api/posts/', views.PostListCreateAPIView.as_view(), name='post-list-create'),
    path('api/posts/<int:pk>/', views.PostRetrieveUpdateDestroyAPIView.as_view(), name='post-detail'),
    path('api/my-posts/', views.UserPostListView.as_view(), name='user-posts'),
]