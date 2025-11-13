from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "flight",
        "seats",
        "payment_status",
        "created_at",
        "updated_at",
    )
    list_filter = ("payment_status", "created_at", "flight")
    search_fields = ("user__username", "user__email", "flight__flight_number")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
