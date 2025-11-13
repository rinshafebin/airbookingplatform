from django.db import models

class Flight(models.Model):
    STATUS_CHOICES = [
        ('on-time', 'On-time'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]

    flight_number = models.CharField(max_length=10, unique=True)
    airline = models.CharField(max_length=50)
    departure_airport = models.CharField(max_length=50)
    arrival_airport = models.CharField(max_length=50)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    available_seats = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='on-time')
    icao24 = models.CharField(max_length=6, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["departure_airport"]),
            models.Index(fields=["arrival_airport"]),
            models.Index(fields=["departure_time"]),
        ]
        ordering = ["departure_time"]

    def __str__(self):
        return f"{self.flight_number} | {self.departure_airport} → {self.arrival_airport}"
