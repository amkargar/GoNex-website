---
title: "Deploy your application"
description: "Build and host a Gonex-backed website or API as a Go service, with explicit configuration, readiness and frontend hosting."
order: 140
version: "main"
section: "build"
group: "SHIP YOUR APP"
---

## A Gonex app needs a backend runtime

Gonex is a Go backend. Its compiled executable must run on a server, container platform or other host that supports a long-running Go process. GitHub Pages serves static files and cannot execute that backend.

If you use a static Nuxt/Vue frontend, you can host it on Pages while the Gonex API runs elsewhere. A Go-rendered HTML website runs with its Gonex server. See [frontend integration](/docs/main/frontend/) for the boundary.

## Build the application

From your application module:

```sh
go mod tidy
go test ./...
go build -o my-site .
```

In the website tutorial, templates and assets are embedded, so the executable includes them. Other layouts may require you to deploy non-embedded files beside the binary.

## Configure the listening address

The tutorial programs read `HTTP_ADDRESS` and pass it to `config.Config`. For a platform that expects a listener on all interfaces, configure the address in the process environment before starting the application:

```sh
HTTP_ADDRESS=0.0.0.0:8080 ./my-site
```

This is POSIX shell syntax. On PowerShell, set `$env:HTTP_ADDRESS = '0.0.0.0:8080'`, then start `./my-site.exe`. Bind only to interfaces appropriate for your deployment; use `127.0.0.1:8080` when a local reverse proxy should be the only entry point.

Gonex does not automatically load `.env` files. Your executable or process manager owns environment/configuration loading. The default `config.Config{}` listener is loopback-only.

## Configure HTTPS and frontend routing

Terminate HTTPS with your platform or reverse proxy. For a separate frontend on the same origin, serve the frontend at `/` and forward `/api/` to the Gonex listener while preserving its `/api` prefix. For a different-origin frontend, configure the backend's allowed CORS origin and the frontend's public API URL.

Decide whether `/openapi.json` should be public. Set `DisableOpenAPI` in the application configuration when it should not be exposed. For generated CLI applications, use their documented `GONEX_DISABLE_OPENAPI` option.

## Health, readiness and shutdown

- Use `/healthz` for the lightweight health response.
- Use `/readyz` for application/dependency readiness.
- Send a normal termination signal and allow the configured shutdown budget to drain work.
- Make managed resources honor context cancellation.

Review [operations](/docs/main/operations/) for readiness and resource lifecycles. Apply [security configuration](/docs/main/security/) before exposing the app.

## Databases and version pinning

Run explicit migrations before starting the application. Set the database environment expected by your executable; serving does not automatically migrate schemas. Do not deploy a `go.mod` that points to a developer machine's absolute replacement path. Keep the reviewed framework version in `go.mod` / `go.sum`, and review [upgrade compatibility](/docs/main/upgrades/) before changing it.

## Current release status

The documentation snapshot has no published stable release. Source availability and successful local examples do not establish a production support guarantee. Review the [release status](/docs/main/release/) and verify your deployment environment.
