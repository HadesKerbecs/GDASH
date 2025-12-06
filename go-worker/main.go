package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/go-resty/resty/v2"
	"github.com/rabbitmq/amqp091-go"
)

type WeatherMessage struct {
	Source                   string   `json:"source"`
	City                     string   `json:"city"`
	Latitude                 float64  `json:"latitude"`
	Longitude                float64  `json:"longitude"`
	Timestamp                string   `json:"timestamp"`
	TemperatureC             float64  `json:"temperature_c"`
	Humidity                 *float64 `json:"humidity"`
	WindSpeed                *float64 `json:"wind_speed_m_s"`
	WeatherCode              *int     `json:"weather_code"`
	PrecipitationProbability *float64 `json:"precipitation_probability"`
	WeatherDescription       *string  `json:"weather_description"`
}

func main() {
	rabbitHost := getEnv("RABBIT_HOST", "rabbitmq")
	rabbitUser := getEnv("RABBIT_USER", "guest")
	rabbitPass := getEnv("RABBIT_PASS", "guest")
	queue := getEnv("RABBIT_QUEUE", "weather_queue")

	connStr := "amqp://" + rabbitUser + ":" + rabbitPass + "@" + rabbitHost + ":5672/"

	conn, err := amqp091.Dial(connStr)
	if err != nil {
		log.Fatalf("Erro ao conectar no RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal: %v", err)
	}
	defer ch.Close()

	msgs, err := ch.Consume(
		queue,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Erro ao consumir fila: %v", err)
	}

	log.Println("Worker Go iniciado. Aguardando mensagens...")

	for msg := range msgs {
		var wm WeatherMessage

		err := json.Unmarshal(msg.Body, &wm)
		if err != nil {
			log.Printf("Erro ao converter JSON: %v", err)
			msg.Nack(false, true)
			continue
		}

		log.Printf("Mensagem recebida: %+v\n", wm)

		err = enviarParaAPI(wm)
		if err != nil {
			log.Printf("Erro ao enviar para API: %v", err)
			msg.Nack(false, true)
			continue
		}

		msg.Ack(false)
	}
}

func enviarParaAPI(w WeatherMessage) error {
	client := resty.New()

	url := "http://backend-api:3000/api/weather/logs"

	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(w).
		Post(url)

	if err != nil {
		return fmt.Errorf("erro de requisição: %w", err)
	}

	if resp.StatusCode() >= 400 {
		return fmt.Errorf("API retornou erro: %s", resp.String())
	}

	log.Printf("API respondeu: %s", resp.Status())
	return nil
}

func getEnv(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}
