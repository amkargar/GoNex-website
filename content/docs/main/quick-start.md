---
title: "Quick start"
description: "Run the Gonex basic example, inspect health and users endpoints, and build the CLI from source."
order: 1
version: "main"
source: "getting-started.md"
---

Run the existing example first, then create an application or register a typed endpoint directly. No database is required for the basic HTTP example.


## Requirements

Use Go 1.27.1, the repository baseline, and a populated module cache or network access for dependency downloads. No published framework release is available yet. The CLI defaults generated projects to v0.1.0; use a local checkout override during development.

## Run the basic example

From the repository root:

```sh
go run ./examples/basic
```

In a second terminal:

```sh
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/users/1
```

Expect `{"status":"ok"}` and `{"id":"1","name":"Ada","email":"ada@example.com"}`. The listener defaults to `127.0.0.1:8080`. `HTTP_ADDRESS` overrides it; Ctrl+C drains requests and closes managed resources. The example uses memory unless `DATABASE_URL` is set.

`/readyz` reports dependency readiness; `/openapi.json` exposes the typed API contract. For persistent storage, follow [databases and migrations](/docs/main/database/). For optional metrics, see [operations](/docs/main/operations/).

## Build the CLI

On macOS/Linux:

```sh
go build -o gonex ./cmd/gonex
```

On Windows:

```powershell
go build -o gonex.exe ./cmd/gonex
.\gonex.exe --help
```

Put the executable on your PATH to use `gonex` from generated projects. After a release is published, install its exact version with `go install github.com/amkargar/gonex/cmd/gonex@VERSION`, replacing VERSION with that release tag.

## Create a project

```sh
gonex new shop --module example.com/acme/shop
cd shop
gonex create module users
gonex create module reports --transport none
```

Before resolving dependencies, configure the local override below if the framework version is unpublished. Then:

```sh
go mod tidy
gonex check
gonex run
```

`GET /users` returns `{"message":"users"}`. `run` invokes Go directly; `build` builds packages; `check` tests, vets and builds. Child failures preserve their exit codes.

### Use an unpublished checkout

For local development only, point the generated module at your checkout before running `go mod tidy`. On Windows, replace the example path as needed:

```powershell
go mod edit -replace=github.com/amkargar/gonex=D:/Projects/gonex
go mod tidy
```

On macOS/Linux, use your absolute checkout path, for example `go mod edit -replace=github.com/amkargar/gonex=/path/to/gonex`. This is an explicit local development override; the generator does not insert machine-specific paths. Remove it with `go mod edit -dropreplace=github.com/amkargar/gonex` and resolve a published version before deployment.

Microservices also depend on the independent contracts module. Resolve or override that module separately in each service; see the [microservices guide](/docs/main/microservices/). Run `go mod tidy` after generators add dependencies.

## Register a typed endpoint

The following complete program registers one module and one typed route. Save it as main.go in a module that resolves the framework:

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

type greeting struct {
	Message string `json:"message"`
}

type helloModule struct{}

func (helloModule) Register(r *app.Registrar) error {
	return transport.Register(r, transport.Endpoint[transport.NoBody, greeting]{
		Method:      "GET",
		Path:        "/hello",
		OperationID: "hello",
		Status:      200,
		Handler: func(context.Context, transport.NoBody) (greeting, error) {
			return greeting{Message: "Hello from goNex"}, nil
		},
	})
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	a, err := gonex.New(config.Config{})
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

`GET /hello` returns `{"message":"Hello from goNex"}` and appears in `/openapi.json`. In an application, move business behavior into a service and keep transport DTOs and mapping in the adapter. See [modules](/docs/main/modules/) and [HTTP contracts](/docs/main/http/).

## Add persistence or API versions

`gonex create module messages --db` adds a local Store interface, GORM adapter/model and an explicit migration with a seeded message. Set `DATABASE_URL` and optionally `DATABASE_DIALECT`, then run `gonex db migrate` before serving. `gonex db status` prints migration history. There is no automatic `.env` loading.

For an initially versioned API:

```sh
gonex create module catalog --http-version v1
go mod tidy
gonex openapi generate --http-version v1 --out v1.json
gonex openapi validate --file v1.json
```

This registers catalog under `/api/v1` without legacy catalog routes. Compare a future export with a reviewed baseline using `gonex openapi validate --file v1.json --against baseline.json`. See [versioning](/docs/main/versioning/) and [upgrades](/docs/main/upgrades/).

## Generator safety

Use `--dry-run` on generator commands to inspect plans without changing project files. Handwritten source is not overwritten. `.gonex.json` records template format and hashes for tool-owned registries; edits to those files cause a conflict before writes. Existing destination directories are refused for new projects.

Writes are staged, guarded with an exclusive lock and rolled back on ordinary application errors. Interrupted OS/process failures may require inspecting `.gonex.lock`; multi-file writes are not crash-atomic. Symlinks, traversal and invalid names are rejected. Names are lowercase Go identifiers; module paths and framework versions follow Go validation.

## Next steps

- [CLI reference](/docs/main/cli/): command syntax and flags.
- [Modules and lifecycle](/docs/main/modules/): service injection and resource ownership.
- [Typed HTTP and OpenAPI](/docs/main/http/): input origins, validation and contracts.
- [Optional gRPC](/docs/main/grpc/) and [microservices](/docs/main/microservices/): independent service boundaries.
- [Operations](/docs/main/operations/) and [security](/docs/main/security/): readiness, shutdown and deployment defaults.
- [Runnable Identity/Orders example](https://github.com/amkargar/gonex/blob/main/examples/microservices/README.md): a completed HTTP-to-gRPC mapping.
