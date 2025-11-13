from rest_framework import serializers
from django.db import transaction
from .models import Booking
from flights.models import Flight
from flights.serializers import FlightSerializer  

class BookingSerializer(serializers.ModelSerializer):
    flight_id = serializers.IntegerField(write_only=True, required=True)
    seats = serializers.IntegerField(required=True, min_value=1)
    flight = FlightSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "flight",
            "flight_id",
            "seats",
            "payment_status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "payment_status", "created_at", "flight"]

    def validate_flight_id(self, value):
        try:
            flight = Flight.objects.get(id=value)
        except Flight.DoesNotExist:
            raise serializers.ValidationError("Invalid flight ID")
        return value

    def validate_seats(self, value):
        if value <= 0:
            raise serializers.ValidationError("Seats must be at least 1")
        return value

    def validate(self, data):
        flight_id = data.get("flight_id")
        seats = data.get("seats")

        flight = Flight.objects.get(id=flight_id)
        if flight.available_seats < seats:
            raise serializers.ValidationError(
                {"seats": "Not enough seats available for this flight."}
            )

        data["flight"] = flight  
        return data

    def create(self, validated_data):
        user = self.context["request"].user
        flight = validated_data["flight"]
        seats = validated_data["seats"]

        with transaction.atomic():
            if flight.available_seats < seats:
                raise serializers.ValidationError(
                    {"seats": "Not enough seats available for this flight."}
                )

            booking = Booking.objects.create(
                user=user,
                flight=flight,
                seats=seats,
                payment_status="Success" 
            )

            flight.available_seats -= seats
            flight.save()

        return booking
