# Same program as weather.py, but it reads a saved answer instead of calling the internet.
# Use it when the school network blocks the API. The code below the data line is identical.
import json

data = json.load(open("sample.json"))
print("Baku right now:", data["current"]["temperature_2m"], "C")
