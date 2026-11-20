import requests
import streamlit as st

CITIES = {"Baku": (40.41, 49.87), "Ganja": (40.68, 46.36)}

st.title("Weather")
city = st.selectbox("City", list(CITIES))
lat, lon = CITIES[city]
url = "https://api.open-meteo.com/v1/forecast"
params = {"latitude": lat, "longitude": lon, "current": "temperature_2m"}
data = requests.get(url, params=params, timeout=10).json()
st.metric("Temperature", f'{data["current"]["temperature_2m"]} C')
