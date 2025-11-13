import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery import shared_task
from .utils import fetch_flight_data

logger = logging.getLogger(__name__)
last_flight_data = {}

@shared_task
def fetch_and_broadcast_flight_updates():
    global last_flight_data

    try:
        data = fetch_flight_data()
        flight_states = data.get("states", [])[:50]

        current_flights = {str(f[0]): {
            "icao24": f[0],
            "callsign": f[1].strip() if f[1] else "",
            "lon": f[5],
            "lat": f[6],
            "altitude": f[7],
        } for f in flight_states}

        if current_flights != last_flight_data:
            last_flight_data = current_flights
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "flight_updates",
                {
                    "type": "flight_status_update",
                    "message": {"flights": current_flights}
                }
            )
            logger.info("Broadcasted %d flights", len(current_flights))

    except Exception as e:
        logger.error("Error fetching/broadcasting flights: %s", e)
