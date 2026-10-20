---
title: "Your first application"
description: "Create your own Go module, import Gonex, register a typed HTTP endpoint and run a working application."
order: 20
version: "main"
section: "build"
group: "GETTING STARTED"
---

This guide builds **your own application** with Gonex as a dependency. You do not run inside the framework repository, and you do not need the CLI or a database.

## Create your project

```sh
mkdir my-site
cd my-site
go mod init example.com/my-site
go get github.com/amkargar/gonex@670c8c5f427e
```

Use Go 1.27.1. If you already have a project, run the `go get` command from its module root instead. The commit is a development snapshot; see [installation](/docs/main/installation/) for the current version policy.

## Register a typed endpoint

Create `main.go` with this complete program:

```go
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
```

The module declares `GET /api/hello`. `transport.Register` associates the request/response types and operation metadata with the route. `a.Register` composes the module into your application, and `a.Run` owns the HTTP listener and graceful shutdown.

## Start the application

```sh
go mod tidy
go run .
```

The default address is `127.0.0.1:8080`. In a second terminal:

```sh
curl http://127.0.0.1:8080/api/hello
```

The response body is:

```json
{"message":"Hello from Gonex"}
```

The framework also exposes health, readiness and the typed API document:

```sh
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/readyz
curl http://127.0.0.1:8080/openapi.json
```

The health/readiness responses are `{"status":"ok"}` and `{"status":"ready"}` once the app is running. Press Ctrl+C to stop cleanly. If the port is occupied, set `HTTP_ADDRESS` in your shell; this program reads it explicitly.

## What you have built

- A standalone Go executable in your own repository.
- One explicit module and a typed JSON endpoint.
- An OpenAPI 3.1 document generated from the registered contract.
- Startup and graceful shutdown tied to the process cancellation context.

The [source example](https://github.com/amkargar/GoNex-website/tree/main/examples/quick-start) contains the same program. A database and gRPC are optional next steps, not prerequisites.

## Turn this into a website

Continue with [Build a website](/docs/main/building-websites/) to add server-rendered HTML and CSS. For Nuxt or another frontend, see [Frontend integration](/docs/main/frontend/).

As the app grows, separate its [project structure](/docs/main/project-structure/) and [modules](/docs/main/modules/). If you prefer generators, use the [CLI guide](/docs/main/cli/).
