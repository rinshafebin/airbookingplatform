from django.db import models
from django.conf import settings
from flights.models import Flight

class Booking(models.Model):
    PAYMENT_CHOICES = [
        ("Pending", "Pending"),
        ("Success", "Success"),
        ("Failed", "Failed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    seats = models.PositiveIntegerField(default=1)
    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_CHOICES,
        default="Pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]  
        unique_together = ("user", "flight")  
        indexes = [
            models.Index(fields=["-created_at"]),      
            models.Index(fields=["payment_status"]),   
        ]

    def __str__(self):
        return f"{self.user} - {self.flight} ({self.seats} seats)"
