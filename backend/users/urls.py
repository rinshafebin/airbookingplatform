from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    RegisterView, LoginView, PendingUserListView,
    ApproveRejectUserAPIView, AdminUserDetailView,
    AdminDashboardAPIView, AllUsersAPIView,
    ForgetPasswordView, ResetPasswordView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/forgot-password/', ForgetPasswordView.as_view(), name='forgot_password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset_password'),

    path('admin/users/pending/', PendingUserListView.as_view(), name='pending_users'),
    path('admin/users/all/', AllUsersAPIView.as_view(), name='all_users'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/users/<int:user_id>/<str:action>/', ApproveRejectUserAPIView.as_view(), name='approve_reject_user'),
    path('admin/dashboard/', AdminDashboardAPIView.as_view(), name='admin_dashboard'),
]

