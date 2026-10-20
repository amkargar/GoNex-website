# Consumer documentation examples

These programs match the complete code blocks in the website's consumer guides. Each is intended for a **separate Go module**. Use Go 1.27.1.

From either `quick-start/` or `website/`:

```sh
go mod init example.com/my-site
go get github.com/amkargar/gonex@670c8c5f427e
go mod tidy
go test ./...
go run .
```

The quick-start API is `/api/hello`. The website example serves `/`, `/assets/app.css`, and `/api/message`, with embedded templates and assets. The framework health/readiness/OpenAPI endpoints are also available. Source status: development snapshot, no published release assumed.

The included main_test.go files check the documented routes using Go HTTP recorders.
