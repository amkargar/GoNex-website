---
title: "Application architecture"
description: "Structure a Gonex application around plain Go business services, explicit modules and optional HTTP, database and gRPC adapters."
order: 50
version: "main"
section: "build"
group: "APPLICATION DESIGN"
---

## Start small

Your first application can fit in one `main.go`. As it grows, organize your own business modules; you do not need to edit the Gonex package. The [project structure guide](/docs/main/project-structure/) shows concrete file responsibilities.

## Compose modules explicitly

A module implements `Register(*app.Registrar) error`. The executable constructs the application and registers its modules:

```go
a, err := gonex.New(config.Config{})
if err != nil { return err }
if err = a.Register(users.Module{}, catalog.Module{}); err != nil { return err }
return a.Run(ctx)
```

This excerpt assumes your application defines the two module types and has an existing context. See the [complete quick-start program](/docs/main/quick-start/) for a runnable single-module example.

## Keep business rules in your service

Your HTTP handler translates requests into service calls. Your service accepts ordinary Go values and depends on small local interfaces. GORM and gRPC implementations sit behind those interfaces when needed.

| Layer in your application | Owns |
| --- | --- |
| Service | Business rules and consumer-owned dependency interfaces |
| HTTP adapter | Request/response `schemas.go`, validation and status mapping |
| Database adapter | GORM models, queries and persistence mapping |
| gRPC adapter | Versioned Protobuf mapping and remote calls |
| Executable/module registration | Construction, configuration and resource composition |

Use a modular monolith first when that fits your application. Independent services and gRPC are optional; there is no requirement to adopt them for an HTTP API.

## Let the application own resources

Managed resources expose `Start(context.Context) error` and `Close(context.Context) error`. Register dependencies before consumers and honor cancellation. Gonex starts them in registration order and closes them in reverse during shutdown. See [modules and lifecycle](/docs/main/modules/) and [operations](/docs/main/operations/).

## Framework internals are a separate path

If your goal is to change how Gonex itself registers routes, generates contracts or scaffolds code, use [Framework internals](/docs/main/contribute/architecture/). This main documentation describes how to build your own application with the public API.
