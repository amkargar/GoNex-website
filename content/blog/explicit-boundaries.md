---
title: "Why explicit boundaries matter in Go"
description: "Modules, adapters, and a business core that does not depend on a transport."
date: "2026-10-20"
author: "Amir Mohammad Kargar"
category: "Architecture"
readingTime: 1
---

## Start with a business interface

An HTTP handler understands status codes, request binding and response schemas. A business service understands a use case. Keeping these responsibilities separate makes it possible to introduce another transport without rewriting the use case.

In Gonex, business services live in `modules/NAME/service.go`. Small interfaces belong to the code that consumes them. The database implementation and transport mapping remain adapters around that core.

## One module, several adapters

A module can register HTTP routes and manage resources. Generated modules expose an injectable service; generated registries construct one service shared across its adapters. This makes composition explicit and avoids scanning source at runtime.

```text
modules/users/
├── module.go
├── service.go
└── http/
    ├── handlers.go
    ├── schemas.go
    ├── routes.go
    └── openapi.go
```

HTTP versions can have independent adapters. Versioned Protobuf messages can map into the same domain values. A repository interface can be implemented in memory or with GORM.

## Resource ownership is part of architecture

Connections and background work need an owner. Gonex resources expose start and close operations. Dependencies register before consumers and close in reverse order. Cancellation must be cooperative; a lifecycle API cannot safely stop arbitrary background work that ignores its context.

Continue with [modules and lifecycle](/docs/main/modules/) and the [application API reference](/docs/main/api-reference/) for the concrete contracts.
