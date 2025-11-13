from django.urls import path
from .views import BookingListCreateAPIView, BookingDetailAPIView, AdminBookingListAPIView

urlpatterns = [
    path('bookings/', BookingListCreateAPIView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDetailAPIView.as_view(), name='booking-detail'),
    path('admin/bookings/', AdminBookingListAPIView.as_view(), name='admin-booking-list'),
]
