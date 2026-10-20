---
title: "Meet Gonex: a little structure, a lot of Go"
description: "A tour of the modular framework, its explicit boundaries, and the best place to begin."
date: "2026-10-20"
author: "Amir Mohammad Kargar"
category: "Project notes"
readingTime: 1
---

## Keep the core in Go

Gonex is built around a straightforward idea: business services should stay readable as plain Go. HTTP schemas, database models and Protobuf messages live at the boundaries, where they translate between a transport and the application.

A module is the unit of composition. It declares routes, resources and readiness checks explicitly. Application startup then manages those resources, and shutdown closes them in reverse order.

## A useful first five minutes

Install the reviewed CLI snapshot and create your own API application:

```sh
go install github.com/amkargar/gonex/cmd/gonex@3ca54b46cb42
gonex new shop --module example.com/acme/shop
cd shop
go mod tidy
go tool gonex create module users
go tool gonex run
```

Request `http://127.0.0.1:8080/users` for the starter JSON response. The terminal displays the bound server URL and correlated request logs. Continue with [Build a REST API](/docs/main/building-api/) for schemas, validation and create/list/get actions. Framework setup belongs in the separate [contributor guides](/docs/main/contribute/).

## Add the pieces you need

The framework combines Gin routing with typed HTTP contracts and OpenAPI 3.1. Optional adapters add GORM persistence or gRPC without putting those details into business interfaces. The CLI scaffolds projects and modules while protecting handwritten code.

Read the [architecture guide](/docs/main/architecture/) to understand those boundaries, or start with the [quick start](/docs/main/quick-start/).

## An honest development snapshot

Gonex has not published a release yet. These pages document the main branch, and examples should be evaluated against that source. Review the [release policy](/docs/main/release/) for verification status and remaining checks. There are no performance or production-maturity promises here: the source and its recorded checks are the starting point.
