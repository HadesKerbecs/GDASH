import requests
from datetime import datetime, timezone
from .models import WeatherData
from .config import LATITUDE, LONGITUDE, CITY

BASE = "https://api.open-meteo.com/v1/forecast"

def fetch_open_meteo(latitude=LATITUDE, longitude=LONGITUDE):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true",
        "hourly": "relativehumidity_2m,precipitation_probability,wind_speed_10m,temperature_2m,weathercode",
        "timezone": "UTC"
    }
    resp = requests.get(BASE, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    current = data.get("current_weather", {})

    # tentativa simples de pegar probabilidade de precipitação
    precip_prob = None
    try:
        hourly = data.get("hourly", {})
        if hourly:
            pp = hourly.get("precipitation_probability", [])
            if pp:
                precip_prob = pp[0]
    except:
        pass

    humidity = None
    try:
        hourly = data.get("hourly", {})
        if hourly:
            hum_list = hourly.get("relativehumidity_2m", [])
            if hum_list:
                humidity = hum_list[0]
    except:
        pass

    weather = WeatherData(
        source="open-meteo",
        city=CITY,
        latitude=latitude,
        longitude=longitude,
        timestamp=datetime.now(timezone.utc),
        temperature_c=current.get("temperature"),
        wind_speed_m_s=current.get("windspeed"),
        weather_code=current.get("weathercode"),
        humidity=humidity,
        precipitation_probability=precip_prob,
        weather_description=None
    )
    return weather
