---
title: "Your first API project"
description: "Create a Gonex project with the CLI, add an HTTP module, run the server and inspect JSON responses, logs and OpenAPI."
order: 20
version: "main"
section: "build"
group: "GETTING STARTED"
---

## Install the CLI

```sh
go install github.com/amkargar/gonex/cmd/gonex@645a2f082d7d
```

Use Go 1.27.1 and put Go's binary directory on PATH. See [installation](/docs/main/installation/) for details. This is a pinned development snapshot, not a stable release.

## Create your application

```sh
gonex new shop --module example.com/acme/shop
cd shop
go mod tidy
```

You now have your own Go application: main.go, config/, modules/, a pinned framework dependency and a project-local CLI tool. No framework clone or Git commands are part of this setup.

## Add an HTTP module

```sh
go tool gonex create module users
```

HTTP is the default transport. This creates a small editable JSON endpoint at `/users` plus service, handler, schemas and route files. There is no database, gRPC or HTTP API version requirement.

## Run and inspect the server

```sh
go tool gonex check
go tool gonex run
```

The terminal displays the actual bound server URL, environment, Gonex version, OpenAPI URL and Ctrl+C instructions after a successful start. Each request emits a completion log with request ID, route, status and elapsed milliseconds. [Configure logs](/docs/main/logging/) for readable development output or production JSON.

From another terminal:

```sh
curl http://127.0.0.1:8080/users
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/openapi.json
```

The module returns:

```json
{"message":"users"}
```

The response header `X-Request-ID` matches the request's log correlation ID. Stop with Ctrl+C to drain requests and close resources.

## Know where to write code

| File | Your responsibility |
| --- | --- |
| `modules/users/service.go` | Business behavior, plain Go inputs and results |
| `modules/users/http/schemas.go` | Request/response DTOs and validation |
| `modules/users/http/handlers.go` | Request-to-service mapping |
| `modules/users/http/routes.go` | Endpoint methods, paths and statuses |
| `modules/users/http/openapi.go` | API descriptions |
| `modules/users/module.go` | Service construction and adapter wiring |

Edit these handwritten files inside your app. Keep `.gonex.json` and generated registries tool-owned. Generators refuse to overwrite existing module code.

## Continue with a real resource API

The starter response demonstrates the structure; it is not generated CRUD. Continue with [Build a REST API](/docs/main/building-api/) for create/list/get users, JSON validation, conflict/not-found errors and OpenAPI. That guide starts from a separate generated project so its custom users module does not conflict with this starter.

[Project structure](/docs/main/project-structure/) explains ownership; [CLI reference](/docs/main/cli/) covers optional database, versioned HTTP and gRPC commands.
