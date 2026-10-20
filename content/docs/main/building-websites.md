---
title: "Build a website"
description: "Build a complete Gonex website with server-rendered HTML templates, embedded CSS and a typed JSON API."
order: 30
version: "main"
section: "build"
group: "WEBSITES & FRONTENDS"
---

Gonex runs your **Go backend**. You can serve HTML directly from it, or use it behind a separate frontend. This tutorial builds a complete small website: a server-rendered page, a CSS asset, and a button that calls a typed JSON API on the same origin.

## Create the project

```sh
mkdir my-site
cd my-site
go mod init example.com/my-site
go get github.com/amkargar/gonex@670c8c5f427e
```

Use Go 1.27.1. Create these files and directories (use your editor or file manager):

```text
my-site/
├── go.mod
├── main.go
├── templates/
│   └── index.html
└── public/
    └── app.css
```

## Add the Go server

Create `main.go`:

```go
package main

import (
	"bytes"
	"context"
	"embed"
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/amkargar/gonex"
	"github.com/amkargar/gonex/app"
	"github.com/amkargar/gonex/config"
	transport "github.com/amkargar/gonex/http"
	"github.com/gin-gonic/gin"
)

//go:embed templates/*.html public/*
var files embed.FS

type siteModule struct{}
type pageData struct{ Title string }
type messageResponse struct {
	Message string `json:"message"`
}

func (siteModule) Register(r *app.Registrar) error {
	pages, err := template.ParseFS(files, "templates/*.html")
	if err != nil {
		return err
	}
	assets, err := fs.Sub(files, "public")
	if err != nil {
		return err
	}

	if err = r.Handle("GET", "/", func(c *gin.Context) {
		var output bytes.Buffer
		if err := pages.ExecuteTemplate(&output, "index.html", pageData{Title: "My Gonex website"}); err != nil {
			c.String(http.StatusInternalServerError, "Could not render page")
			return
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", output.Bytes())
	}); err != nil {
		return err
	}

	static := http.StripPrefix("/assets/", http.FileServer(http.FS(assets)))
	if err = r.Handle("GET", "/assets/*filepath", gin.WrapH(static)); err != nil {
		return err
	}

	return transport.Register(r, transport.Endpoint[transport.NoBody, messageResponse]{
		Method: "GET", Path: "/api/message", OperationID: "siteMessage", Status: 200,
		Handler: func(context.Context, transport.NoBody) (messageResponse, error) {
			return messageResponse{Message: "Your website is powered by Gonex."}, nil
		},
	})
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	a, err := gonex.New(config.Config{Address: os.Getenv("HTTP_ADDRESS")})
	if err != nil {
		log.Fatal(err)
	}
	if err = a.Register(siteModule{}); err != nil {
		log.Fatal(err)
	}
	if err = a.Run(ctx); err != nil {
		log.Fatal(err)
	}
}
```

The standard library's `html/template` renders HTML with automatic contextual escaping. Rendering completes in a buffer before the response is written, so template errors can return a proper 500 response. The embedded filesystem keeps the page and CSS inside your executable.

HTML and CSS use the registrar's Gin-compatible `Handle` adapter. The JSON endpoint uses the typed `transport.Register` API. You do not need to access or replace Gonex's internal router.

## Add the HTML page

Create `templates/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ .Title }}</title>
  <meta name="description" content="My first website built with Gonex and Go.">
  <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
  <main>
    <h1>{{ .Title }}</h1>
    <p>This HTML was rendered on the server.</p>
    <button id="load" type="button">Call the Gonex API</button>
    <p id="message" role="status" aria-live="polite"></p>
  </main>
  <script>
    document.getElementById('load').addEventListener('click', async () => {
      const output = document.getElementById('message');
      try {
        const response = await fetch('/api/message');
        if (!response.ok) throw new Error('Request failed');
        const data = await response.json();
        output.textContent = data.message;
      } catch {
        output.textContent = 'Could not load the message. Try again.';
      }
    });
  </script>
</body>
</html>
```

The title and heading are rendered by Go on the server, so the document is readable before JavaScript runs. The button enhances the page by calling `/api/message`. Using `textContent` displays the response as text instead of interpreting it as HTML.

## Add the stylesheet

Create `public/app.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; background: #f9f9f3; color: #252820; }
main { max-width: 42rem; margin: 5rem auto; padding: 1.5rem; }
h1 { line-height: 1.15; }
button { padding: .8rem 1rem; background: #f7d34c; color: #252820; border: 0; border-radius: .5rem; cursor: pointer; }
button:focus-visible { outline: 3px solid currentColor; outline-offset: 4px; }
```

The browser requests `/assets/app.css`; the Go handler maps that URL to the embedded public directory. The working source is available in the [website example](https://github.com/amkargar/GoNex-website/tree/main/examples/website).

## Run and open your website

```sh
go mod tidy
go run .
```

Open **http://127.0.0.1:8080/**. You should see “My Gonex website”. Click **Call the Gonex API** to display the JSON endpoint's message.

You can also inspect each response directly:

```sh
curl http://127.0.0.1:8080/
curl http://127.0.0.1:8080/assets/app.css
curl http://127.0.0.1:8080/api/message
```

`GET /api/message` returns:

```json
{"message":"Your website is powered by Gonex."}
```

The typed JSON route appears in `/openapi.json`. Raw HTML/static routes registered with `Handle` are not automatically included in OpenAPI. Because templates and assets are embedded, rebuild the executable after changing either file.

## Grow beyond this example

Move business rules into `modules/<name>/service.go`, HTTP request/response schemas into `schemas.go`, and database details into optional adapters. Add forms and their POST handlers deliberately, with validation and application-owned authentication/CSRF protection where needed.

For a frontend framework, follow [Frontend integration](/docs/main/frontend/). For production hosting, follow [Deploy your application](/docs/main/deployment/).
