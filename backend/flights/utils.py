from itertools import permutations
import requests
from decouple import config

# def get_opensky_token():
    # client_id = config("OPENSKY_CLIENT_ID")
    # client_secret = config("OPENSKY_CLIENT_SECRET")

    # token_url = "https://opensky-network.org/oauth/token"
    # response = requests.post(
    #     token_url,
    #     data={"grant_type": "client_credentials"},
    #     auth=(client_id, client_secret)
    # )
    # print('datasss ',token_url)
    # if response.status_code == 200:
    #     return response.json()["access_token"]
    # else:
    #     raise Exception(f"Failed to get token: {response.status_code} {response.text}")

def fetch_flight_data():
    # token = get_opensky_token()

    response = requests.get("https://opensky-network.org/api/states/all")
    print('restult',response)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"OpenSky API error: {response.status_code} {response.text}")
