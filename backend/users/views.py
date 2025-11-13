from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser
from django.db import transaction
from users.models import User, OTP
from django.core.mail import send_mail
from django.conf import settings
from users.serializers import (
    RegisterSerializer,
    LoginSerializer,
    AdminUserSerializer,
    AdminUserDetailSerializer,
    UserSerializer,
    ForgetPasswordSerializer,
    ResetPasswordSerializer,
)
import random


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "User registered successfully. Waiting for admin approval."},
                        status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        print(request.data)
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_superuser,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })



class PendingUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_users = User.objects.filter(approval_status='pending')
        serializer = AdminUserSerializer(pending_users, many=True)
        return Response(serializer.data)


class ApproveRejectUserAPIView(APIView):
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def post(self, request, user_id, action):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        if action == "approve":
            user.is_active = True
            user.approval_status = "approved"
            user.save()
            return Response({"message": "User approved successfully"})

        elif action == "reject":
            user.approval_status = "rejected"
            user.delete()
            return Response({"message": "User rejected successfully"})

        else:
            return Response({"error": "Invalid action"}, status=400)


class AllUsersAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        all_users = User.objects.filter(is_superuser=False)
        serializer = UserSerializer(all_users, many=True)
        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
        serializer = AdminUserDetailSerializer(user)
        return Response(serializer.data)


class AdminDashboardAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_users_count = User.objects.filter(approval_status='pending').count()
        from flights.models import Flight
        from bookings.models import Booking
        active_flights_count = Flight.objects.filter(status='on-time').count()
        total_bookings_count = Booking.objects.count()
        return Response({
            "pending_registrations": pending_users_count,
            "active_flights": active_flights_count,
            "total_bookings": total_bookings_count,
        })



class ForgetPasswordView(APIView):
    def post(self, request):
        serializer = ForgetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        otp = str(random.randint(100000, 999999))
        OTP.objects.create(user=user, code=otp)

        send_mail(
            subject="Your password reset OTP",
            message=f"Hello {user.username},\nYour OTP for password reset is: {otp}\nIt expires in 5 minutes.",
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com"),
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({"message": "OTP sent to your email"})


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp"].strip()
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        otp_obj = OTP.objects.filter(
            user=user, code=otp_code, is_used=False
        ).order_by('-created_at').first()

        if not otp_obj:
            return Response({"error": "Invalid OTP."}, status=400)
        if otp_obj.is_expired():
            return Response({"error": "OTP expired."}, status=400)

        user.set_password(new_password)
        user.save()
        otp_obj.mark_used()

        return Response({"message": "Password reset successfully."})
