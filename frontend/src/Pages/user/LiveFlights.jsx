import React, { useEffect, useState, useRef } from "react";
import { Plane, Activity, MapPin, Navigation } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function LiveFlights() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef({});
  const wsRef = useRef(null);

  // Initialize Leaflet map
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || mapInstance.current) return;

    mapInstance.current = window.L.map(mapRef.current).setView([20, 0], 3);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);
  };

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8000/ws/flights/");

      wsRef.current.onopen = () => {
        console.log("Connected to flight tracker");
        setConnectionStatus("connected");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.flights) {
          const flightsArray = Object.values(data.flights);
          setFlights(flightsArray);
          updateMapMarkers(flightsArray);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
      };

      wsRef.current.onclose = () => {
        console.log("Disconnected from flight tracker");
        setConnectionStatus("disconnected");
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const updateMapMarkers = (flightsData) => {
    if (!window.L || !mapInstance.current) return;

    const currentIcao24s = new Set(flightsData.map((f) => f.icao24));

    // Remove old markers
    Object.keys(markers.current).forEach((icao24) => {
      if (!currentIcao24s.has(icao24)) {
        mapInstance.current.removeLayer(markers.current[icao24]);
        delete markers.current[icao24];
      }
    });

    // Add or update markers
    flightsData.forEach((flight) => {
      if (flight.lat && flight.lon) {
        const position = [flight.lat, flight.lon];

        if (markers.current[flight.icao24]) {
          // Update existing marker
          markers.current[flight.icao24].setLatLng(position);
        } else {
          // Create plane icon
          const planeIcon = window.L.divIcon({
            html: '✈️',
            className: 'plane-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          // Create new marker
          const marker = window.L.marker(position, { icon: planeIcon }).addTo(
            mapInstance.current
          );

          // Create popup content
          const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <div style="font-weight: bold; font-size: 1.125rem; color: #f97316; margin-bottom: 8px;">
                ${flight.callsign || flight.icao24}
              </div>
              <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 4px;">
                <strong>ICAO24:</strong> ${flight.icao24}
              </div>
              <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 4px;">
                <strong>Lat:</strong> ${flight.lat.toFixed(4)}
              </div>
              <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 4px;">
                <strong>Lon:</strong> ${flight.lon.toFixed(4)}
              </div>
              <div style="font-size: 0.875rem; color: #6b7280;">
                <strong>Altitude:</strong> ${
                  flight.altitude ? flight.altitude.toFixed(2) + " m" : "N/A"
                }
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 250,
          });

          // Add click event
          marker.on("click", () => {
            setSelectedFlight(flight);
          });

          markers.current[flight.icao24] = marker;
        }
      }
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-700";
      case "disconnected":
        return "bg-red-100 text-red-700";
      case "error":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "● Connected";
      case "disconnected":
        return "● Disconnected";
      case "error":
        return "● Error";
      default:
        return "● Connecting...";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        {/* Header */}
        <div className="bg-white shadow-md border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Live Flight <span className="text-orange-500">Tracker</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Flights: </span>
                <span className="font-bold text-orange-600">
                  {flights.length}
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
              >
                {getStatusText()}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            style={{ height: "calc(100vh - 200px)", width: "100%" }}
            className="z-0"
          />

          {/* Flight Info Panel (Floating) */}
          {selectedFlight && (
            <div className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-orange-100 z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedFlight.callsign || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ICAO24: {selectedFlight.icao24}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFlight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">Position:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedFlight.lat?.toFixed(4)},{" "}
                    {selectedFlight.lon?.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">Altitude:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedFlight.altitude
                      ? `${selectedFlight.altitude.toFixed(2)} m`
                      : "N/A"}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (mapInstance.current && selectedFlight.lat && selectedFlight.lon) {
                      mapInstance.current.setView(
                        [selectedFlight.lat, selectedFlight.lon],
                        8
                      );
                    }
                  }}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Center on Map
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Flight List (Bottom) */}
        <div className="bg-white border-t border-orange-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Active Flights
              </h2>
            </div>

            <div className="max-h-40 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {flights.slice(0, 12).map((flight) => (
                  <div
                    key={flight.icao24}
                    onClick={() => {
                      setSelectedFlight(flight);
                      if (mapInstance.current && flight.lat && flight.lon) {
                        mapInstance.current.setView([flight.lat, flight.lon], 6);
                      }
                    }}
                    className="bg-orange-50 hover:bg-orange-100 rounded-lg p-3 cursor-pointer transition border border-orange-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {flight.callsign || flight.icao24}
                        </p>
                        <p className="text-xs text-gray-600">
                          {flight.lat?.toFixed(2)}, {flight.lon?.toFixed(2)}
                        </p>
                      </div>
                      <Plane className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add custom styles for plane icon */}
      <style jsx>{`
        .plane-icon {
          font-size: 24px;
          transform: rotate(45deg);
        }
      `}</style>
    </>
  );
}