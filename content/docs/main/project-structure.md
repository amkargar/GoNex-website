---
title: "Organize your project"
description: "Organize a Gonex application into business modules, schemas.go HTTP adapters, configuration and a small executable."
order: 55
version: "main"
section: "build"
group: "APPLICATION DESIGN"
---

## A small application

The [quick start](/docs/main/quick-start/) uses a single file so you can see the complete lifecycle. You can keep that structure while the application is small.

## A growing application

As business capabilities grow, a typical application looks like this:

```text
my-site/
├── main.go
├── go.mod
├── go.sum
├── config/
│   └── config.go
├── modules/
│   ├── users/
│   │   ├── module.go
│   │   ├── service.go
│   │   └── http/
│   │       ├── handlers.go
│   │       ├── schemas.go
│   │       ├── routes.go
│   │       └── openapi.go
│   └── catalog/
├── templates/
└── public/
```

Templates and public files are only needed if the Go application serves HTML/assets. A separate frontend may live in its own directory or repository.

## File responsibilities

- `main.go`: load configuration, construct Gonex, register modules and run with a cancellation context.
- `module.go`: construct/share the module's service, then register its adapters and managed resources.
- `service.go`: business behavior, plain Go values and small consumer-owned interfaces.
- `schemas.go`: HTTP request and response DTOs and validation tags.
- `handlers.go`: request-to-service calls and response mapping.
- `routes.go` / `openapi.go`: typed endpoint registration and public contract metadata.

A database adapter and models can be added when you need persistence. Keep migration execution explicit. See [databases](/docs/main/database/).

## Manual composition or CLI scaffolding

You can create these files yourself and use the public registration APIs. The [CLI](/docs/main/cli/) generates the supported project layout and ownership metadata. Tool-owned registries are hash-checked, so keep handwritten business changes in the files designated for application code.

Do not copy the framework's internal package tree into your app. Gonex remains a dependency in your `go.mod`; [contributor documentation](/docs/main/contribute/) is for changes to that dependency itself.
