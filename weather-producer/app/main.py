import time
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from .fetcher import fetch_open_meteo
from .publisher import RabbitPublisher
from .config import INTERVAL_MINUTES

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def job():
    try:
        weather = fetch_open_meteo()
        data = weather.dict()
        publisher.publish(data)
    except Exception as e:
        logging.exception("Erro no job de coleta/publicação: %s", e)

if __name__ == "__main__":
    publisher = RabbitPublisher()
    scheduler = BlockingScheduler()
    job()
    scheduler.add_job(job, 'interval', minutes=INTERVAL_MINUTES)
    try:
        logging.info("Iniciando scheduler...")
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logging.info("Encerrando serviço")
