from django.urls import path
from flights.views import FlightListCreateAPIView, FlightDetailAPIView,FlightStatsAPIView
urlpatterns = [
    path('flights/', FlightListCreateAPIView.as_view(), name='flight-list-create'),
    path('flights/<int:pk>/', FlightDetailAPIView.as_view(), name='flight-detail'),
    path("flights/stats/", FlightStatsAPIView.as_view(), name="flight-stats"),

]
