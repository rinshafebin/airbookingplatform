from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related("flight")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            serializer.save(user=request.user, payment_status="Success")
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookingDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def delete(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, user=request.user)

        with transaction.atomic():
            booking.flight.available_seats += booking.seats
            booking.flight.save()
            booking.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



class AdminBookingListAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        
        bookings = Booking.objects.all().select_related("user", "flight")
        print(bookings)
        flight_id = request.GET.get("flight_id")
        user_id = request.GET.get("user_id")
        if flight_id:
            bookings = bookings.filter(flight_id=flight_id)
        if user_id:
            bookings = bookings.filter(user_id=user_id)

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
