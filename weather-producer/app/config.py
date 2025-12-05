from dotenv import load_dotenv
import os

load_dotenv()

RABBIT_HOST = os.getenv("RABBIT_HOST", "rabbitmq")
RABBIT_PORT = int(os.getenv("RABBIT_PORT", 5672))
RABBIT_USER = os.getenv("RABBIT_USER", "guest")
RABBIT_PASS = os.getenv("RABBIT_PASS", "guest")
RABBIT_QUEUE = os.getenv("RABBIT_QUEUE", "weather_queue")

LATITUDE = float(os.getenv("LATITUDE", "0.0"))
LONGITUDE = float(os.getenv("LONGITUDE", "0.0"))
CITY = os.getenv("CITY", "Unknown")

INTERVAL_MINUTES = int(os.getenv("INTERVAL_MINUTES", "60"))
