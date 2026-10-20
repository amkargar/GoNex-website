---
title: "Connect a frontend"
description: "Use Gonex as the backend for a Nuxt, Vue, React or Flutter frontend, with clear API URLs and deployment boundaries."
order: 40
version: "main"
section: "build"
group: "APPLICATION DESIGN"
---

Gonex handles backend HTTP APIs. Nuxt, Vue, React or Flutter can consume those APIs. They do not import Go packages directly: the browser/client communicates with your Go process over HTTP.

## Start with a working endpoint

Complete [Build a REST API](/docs/main/building-api/) and confirm that `http://127.0.0.1:8080/api/users` returns a JSON list after completing the resource API guide. Keep that Gonex process running while developing your frontend.

## Choose how the frontend is served

| Approach | What serves the page? | Where Gonex runs |
| --- | --- | --- |
| Separate Nuxt/Vue/React frontend | Its dev server, static host or SSR server | A Go backend process |
| Static frontend hosted on GitHub Pages | GitHub Pages | A separate backend host |

## Browser requests on the same origin

If a reverse proxy routes `/api/` to Gonex and serves your frontend on the same HTTPS origin, use relative requests:

```ts
const response = await fetch('/api/users')
if (!response.ok) throw new Error('Could not load users')
const data: { items: { id: string; name: string; email: string }[] } = await response.json()
console.log(data.items)
```

Configure the reverse proxy to forward `/api/users` **without stripping `/api`**, because that is the route registered by the resource API example. In development, use your frontend tool's development proxy if you want the same relative URLs.

## Nuxt example with an explicit API origin

The following client-only request can be placed inside a Nuxt page's `<script setup lang="ts">`. This example uses Nuxt's public runtime config so the browser can reach the correct backend URL.

In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8080'
    }
  }
})
```

In your page:

```vue
<script setup lang="ts">
const config = useRuntimeConfig()
const { data, status, error } = await useFetch<{ items: { id: string; name: string; email: string }[] }>(
  `${config.public.apiBase}/api/users`,
  { server: false }
)
</script>

<template>
  <p v-if="status === 'pending'">Loading…</p>
  <p v-else-if="error">Could not load users.</p>
  <ul v-else><li v-for="user in data?.items" :key="user.id">{{ user.name }}</li></ul>
</template>
```

Set `NUXT_PUBLIC_API_BASE` to your backend's public HTTPS origin in production. For a statically generated frontend, configure it at build time and rebuild when it changes. An end user's browser cannot use your development machine's `127.0.0.1` as a production backend.

## Different origins require a CORS policy

A frontend at `http://localhost:3000` and a backend at `http://127.0.0.1:8080` are different origins. The browser blocks cross-origin calls unless the backend explicitly permits the frontend origin. A development proxy avoids this browser cross-origin boundary; a separately hosted frontend needs a deliberate CORS policy.

The example API does not enable CORS automatically. Configure it according to the [security guide](/docs/main/security/). CORS is not authentication. Avoid broad origin/credential policies; keep secrets on the backend. If using cookie-authenticated cross-site requests, review cookie and CSRF behavior as part of your application security design.

## Static hosting is only the frontend

GitHub Pages can host a generated frontend, but cannot run your Gonex server or database. Deploy the API to a host that runs Go services, then configure the frontend's API URL and allowed origin. See [deployment](/docs/main/deployment/).
