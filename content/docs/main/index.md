---
title: "Introduction"
description: "Meet Gonex: a modular Go framework for typed HTTP APIs, explicit modules, optional persistence and gRPC."
order: 0
version: "main"
source: "README.md"
---

Gonex is a modular Go framework for typed HTTP APIs and explicit service boundaries. Gin handles routing; typed request and response contracts describe your API; your business services stay in plain Go.

## Start here

New to Gonex? Follow the [quick start](/docs/main/quick-start/) to run the repository example. Then learn about [modules](/docs/main/modules/) and [HTTP contracts](/docs/main/http/).

## Development snapshot

These guides document the repository’s **main branch**, not a published release. The upstream project reports implementation commits for phases 0–8; hosted CI, Linux race tests and live PostgreSQL verification remain pending in its README. Review the [release policy](/docs/main/release/) before choosing a production dependency.

## What is included?

- Explicit module registration, managed resources and graceful shutdown.
- Gin-backed typed HTTP handlers and OpenAPI 3.1.
- Optional GORM persistence, SQL migrations and versioned HTTP adapters.
- Optional gRPC, TLS/mTLS and independent service scaffolding.
- Safe CLI generation with dry runs and handwritten file protection.

## How to read these guides

Use the sidebar to follow the build path, use the table of contents to jump within a guide, or search with Ctrl/Cmd + K. Code samples are preserved from the upstream documentation. The version selector will include released documentation when release snapshots are added.

