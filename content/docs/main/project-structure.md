---
title: "Organize your API project"
description: "Develop inside a CLI-generated Gonex application with clear service, schema, handler and route responsibilities and protected registries."
order: 55
version: "main"
section: "build"
group: "APPLICATION DESIGN"
---

## The generated layout

Start with `gonex new shop --module example.com/acme/shop`, then `go mod tidy` and `go tool gonex create module users` inside shop:

```text
shop/
├── go.mod
├── go.sum
├── main.go
├── .gonex.json
├── config/
│   └── config.go
└── modules/
    ├── registry_gen.go
    └── users/
        ├── module.go
        ├── service.go
        ├── service_test.go
        ├── http_registry_gen.go
        └── http/
            ├── schemas.go
            ├── handlers.go
            ├── routes.go
            └── openapi.go
```

`go.mod` tracks Gonex as the runtime library and CLI development tool. The server has no application HTML/CSS scaffold. HTTP API versioning, database files and gRPC adapters appear only when requested.

## Files you edit

- `main.go`: application construction, explicit modules and signal handling.
- `config/config.go`: environment/configuration mapping, logging and exposure settings.
- `module.go`: service construction and adapter wiring.
- `service.go`: plain Go business behavior and local interfaces.
- `schemas.go`: HTTP DTOs and validation tags.
- `handlers.go`: request-to-service calls and response mapping.
- `routes.go` and `openapi.go`: typed routes and contract descriptions.
- Tests: verify your application's domain and API behavior.

These are application files owned by you. The CLI does not continuously regenerate your service logic. A starter module exposes a message endpoint; implementing resource actions is deliberate development, as shown in [Build a REST API](/docs/main/building-api/).

## Tool-owned files

Keep `.gonex.json`, `modules/registry_gen.go`, and generated adapter registries under tool ownership. Generators hash-check these files and reject conflicting manual edits. Use commands to add modules, enable transports and create versions. When changing a handwritten adapter's interface, update its module wiring deliberately rather than breaking a generated registry's assumptions.

## Keep developing

```sh
go tool gonex create module products
go tool gonex check
go tool gonex run
```

A separate frontend consumes the API over HTTP. Optional database adapters and models stay at the module boundary; migration execution remains explicit.
