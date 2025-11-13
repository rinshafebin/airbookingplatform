from rest_framework import serializers
from .models import Flight

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'
        read_only_fields = ('id',)

    def validate(self, data):
        if data["departure_time"] >= data["arrival_time"]:
            raise serializers.ValidationError("Arrival must be after departure time.")
        if data["price"] <= 0:
            raise serializers.ValidationError("Price must be positive.")
        if data["available_seats"] < 0:
            raise serializers.ValidationError("Available seats cannot be negative.")
        return data

class FlightStatsSerializer(serializers.Serializer):
    total_flights = serializers.IntegerField()
    total_airlines = serializers.IntegerField()
    total_available_seats = serializers.IntegerField()