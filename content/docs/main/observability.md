---
title: "Metrics and tracing"
description: "Correlate Gonex request logs and unary RPC traces, collect bounded latency histograms and opt in to Prometheus metrics."
order: 147
version: "main"
section: "build"
group: "SHIP YOUR APP"
source: "observability.md"
---

## Correlate requests

Default request logging now includes service, environment, request_id and trace_id. The server returns X-Request-ID and a validated W3C traceparent. Pass the request context into services to retain correlation. HTTP-to-gRPC unary instrumentation preserves the trace ID; streaming instrumentation and an OTLP span exporter are not declared supported.

## Opt in to metrics

Install `observability.HTTP(metrics)` through application middleware and manage the Metrics resource in your module. Metrics collect requests, errors, in-flight work and cumulative latency buckets. Each collector retains at most 128 operation labels, including overflow; labels are limited to 160 bytes and must not contain control characters. Use fixed route/RPC patterns, never user IDs or raw URLs.

Finite histogram boundaries are 5, 10, 25, 50, 100, 250, 500, 1000, 2500 and 5000 milliseconds, plus +Inf. Snapshots are concurrency safe. The default application requires no metrics backend.

## Export to Prometheus

The optional `github.com/amkargar/gonex/observability/prometheus` package supplies `Handler(metrics)`. Mount this standard net/http handler deliberately on a protected operational route/listener. It emits Prometheus text 0.0.4 and starts no network client or exporter worker. A disconnected monitoring backend cannot block API requests through a push exporter because none is started.

The [diagnostic source example](https://github.com/amkargar/gonex/tree/main/examples/observability) demonstrates a dependency failure, 503 readiness, correlated logs and counters/histograms, followed by recovery. The executable is a maintainer demonstration; install Gonex in your own application using the [CLI guide](/docs/main/quick-start/).

## Privacy and cost

Default logs/labels exclude bodies, tokens, headers, query strings and raw unmatched paths. Nonstandard method tokens use OTHER. Application-defined fields remain your responsibility. Custom writers/readiness callbacks must honor their contracts; arbitrary callbacks cannot be forcibly interrupted safely.

Core and telemetry overhead are measured separately, including paced loopback workloads and CPU/heap profiles. Review the [readiness evidence](/docs/main/production-readiness/) before treating short CI results as deployment SLOs.
