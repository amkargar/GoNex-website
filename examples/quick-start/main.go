package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/amkargar/gonex"
	"github.com/amkargar/gonex/app"
	"github.com/amkargar/gonex/config"
	transport "github.com/amkargar/gonex/http"
)

type helloResponse struct {
	Message string `json:"message"`
}

type helloModule struct{}

func (helloModule) Register(r *app.Registrar) error {
	return transport.Register(r, transport.Endpoint[transport.NoBody, helloResponse]{
		Method:      "GET",
		Path:        "/api/hello",
		OperationID: "hello",
		Status:      200,
		Handler: func(context.Context, transport.NoBody) (helloResponse, error) {
			return helloResponse{Message: "Hello from Gonex"}, nil
		},
	})
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	a, err := gonex.New(config.Config{Address: os.Getenv("HTTP_ADDRESS")})
	if err != nil {
		log.Fatal(err)
	}
	if err = a.Register(helloModule{}); err != nil {
		log.Fatal(err)
	}
	if err = a.Run(ctx); err != nil {
		log.Fatal(err)
	}
}
