import json
from channels.generic.websocket import AsyncWebsocketConsumer

class FlightConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("flight_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("flight_updates", self.channel_name)

    async def flight_status_update(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))
