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

The repository includes a runnable users API. Clone the source and start it:

```sh
git clone https://github.com/amkargar/gonex.git
cd gonex
go run ./examples/basic
```

In a second terminal, request `http://127.0.0.1:8080/users/1`. The example returns Ada's in-memory user record. No database is required for this first step.

## Add the pieces you need

The framework combines Gin routing with typed HTTP contracts and OpenAPI 3.1. Optional adapters add GORM persistence or gRPC without putting those details into business interfaces. The CLI scaffolds projects and modules while protecting handwritten code.

Read the [architecture guide](/docs/main/architecture/) to understand those boundaries, or start with the [quick start](/docs/main/quick-start/).

## An honest development snapshot

Gonex has not published a release yet. These pages document the main branch, and examples should be evaluated against that source. Review the [release policy](/docs/main/release/) for verification status and remaining checks. There are no performance or production-maturity promises here: the source and its recorded checks are the starting point.
