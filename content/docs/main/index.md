---
title: "Build APIs with Gonex"
description: "Install Gonex, generate projects and modules with its CLI, and develop typed JSON APIs with validation, OpenAPI and structured logs."
order: 0
version: "main"
section: "build"
group: "GETTING STARTED"
---

Gonex is an **API-first Go framework** with explicit modules, typed request/response schemas, validation and OpenAPI. Its development workflow is inspired by DRF: install the dependency, create your own application, add modules and implement APIs inside that application.

## Start building

1. [Install Gonex and its CLI](/docs/main/installation/).
2. [Create a project, add a module and run it](/docs/main/quick-start/).
3. [Build a REST API](/docs/main/building-api/) with create/list/get endpoints.
4. [Understand the generated structure](/docs/main/project-structure/).
5. [Configure server output and logs](/docs/main/logging/), then [deploy](/docs/main/deployment/).

A database, gRPC and HTTP versioning are optional. Frontends consume Gonex over HTTP; application HTML templates and CSS are outside the current framework workflow.

## Familiar API responsibilities

| Responsibility | Gonex file |
| --- | --- |
| Request/response schemas and validation, similar to serializers | `schemas.go` |
| HTTP handlers, similar to views | `handlers.go` |
| Endpoint registration, similar to routing | `routes.go` |
| Business behavior | `service.go` |
| Feature composition | `module.go` |

The comparison describes responsibilities, not identical APIs. Automatic ModelViewSets, ORM model-to-CRUD generation and a Django-style admin are not current features.

## Two documentation paths

**Build with Gonex** is the main track for application developers: package installation, CLI projects, modules, API development, optional persistence and deployment. No framework fork or clone is required.

**[Contribute to Gonex](/docs/main/contribute/)** is for changing the framework itself: source setup, internals, tests and pull requests. Clone instructions stay there.

## Version support

The version selector chooses a documentation snapshot. It is separate from optional HTTP API versions such as `/api/v1`. These guides pin a reviewed `main` development snapshot; no stable release is assumed. See [release status](/docs/main/release/) and [upgrades](/docs/main/upgrades/).
