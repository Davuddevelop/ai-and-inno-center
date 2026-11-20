import requests

url = "https://api.open-meteo.com/v1/forecast"
params = {"latitude": 40.41, "longitude": 49.87, "current": "temperature_2m"}
data = requests.get(url, params=params, timeout=10).json()
print("Baku right now:", data["current"]["temperature_2m"], "C")
