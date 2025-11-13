from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from flights.models import Flight
from flights.serializers import FlightSerializer,FlightStatsSerializer
from flights.permissions import IsAdminUserOrReadOnly
from rest_framework.permissions import IsAdminUser
from django.db import models




class FlightListCreateAPIView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]

    def get(self, request):
        flights = Flight.objects.all()
        departure = request.GET.get('departure_airport')
        arrival = request.GET.get('arrival_airport')
        date = request.GET.get('date')

        if departure:
            flights = flights.filter(departure_airport__icontains=departure)
        if arrival:
            flights = flights.filter(arrival_airport__icontains=arrival)
        if date:
            flights = flights.filter(departure_time__date=date)

        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FlightSerializer(data=request.data,many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class FlightDetailAPIView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]

    def get(self, request, pk):
        flight = get_object_or_404(Flight, pk=pk)
        serializer = FlightSerializer(flight)
        return Response(serializer.data)

    def put(self, request, pk):
        flight = get_object_or_404(Flight, pk=pk)
        serializer = FlightSerializer(flight, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        flight = get_object_or_404(Flight, pk=pk)
        flight.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class FlightStatsAPIView(APIView):
    permission_classes = [IsAdminUser]  

    def get(self, request):
        total_flights = Flight.objects.count()
        total_airlines = Flight.objects.values('airline').distinct().count()
        total_available_seats = Flight.objects.aggregate(total=models.Sum('available_seats'))['total'] or 0

        data = {
            "total_flights": total_flights,
            "total_airlines": total_airlines,
            "total_available_seats": total_available_seats
        }

        serializer = FlightStatsSerializer(data)
        return Response(serializer.data)
    
    