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

Start in your own application module and add the reviewed framework snapshot:

```sh
mkdir my-site
cd my-site
go mod init example.com/my-site
go get github.com/amkargar/gonex@670c8c5f427e
```

Copy the complete program from [Your first application](/docs/main/quick-start/), run it, and request `http://127.0.0.1:8080/api/hello`. No database is required. Continue to [Build a website](/docs/main/building-websites/) for HTML templates and CSS. Framework setup and tests are in the separate [contributor guides](/docs/main/contribute/).

## Add the pieces you need

The framework combines Gin routing with typed HTTP contracts and OpenAPI 3.1. Optional adapters add GORM persistence or gRPC without putting those details into business interfaces. The CLI scaffolds projects and modules while protecting handwritten code.

Read the [architecture guide](/docs/main/architecture/) to understand those boundaries, or start with the [quick start](/docs/main/quick-start/).

## An honest development snapshot

Gonex has not published a release yet. These pages document the main branch, and examples should be evaluated against that source. Review the [release policy](/docs/main/release/) for verification status and remaining checks. There are no performance or production-maturity promises here: the source and its recorded checks are the starting point.
