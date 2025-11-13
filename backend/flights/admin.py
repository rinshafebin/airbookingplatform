from django.contrib import admin
from .models import Flight

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ("flight_number", "airline", "departure_airport", "arrival_airport",
                    "departure_time", "arrival_time", "price", "available_seats", "status")
    list_filter = ("status", "airline", "departure_airport", "arrival_airport")
    search_fields = ("flight_number", "airline", "departure_airport", "arrival_airport")
    ordering = ("departure_time",)
