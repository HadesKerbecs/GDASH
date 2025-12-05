from app.models import WeatherData
from datetime import datetime, timezone

def test_model():
    w = WeatherData(
        source="open-meteo",
        city="X",
        latitude=0.0,
        longitude=0.0,
        timestamp=datetime.now(timezone.utc)
    )
    assert w.source == "open-meteo"
