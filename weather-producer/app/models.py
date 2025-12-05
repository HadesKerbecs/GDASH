from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WeatherData(BaseModel):
    source: str
    city: str
    latitude: float
    longitude: float
    timestamp: datetime
    temperature_c: Optional[float]
    humidity: Optional[float]
    wind_speed_m_s: Optional[float]
    weather_code: Optional[int]
    weather_description: Optional[str]
    precipitation_probability: Optional[float]
