# Gonex users API

This standalone consumer app was generated with `gonex new api --module example.com/shop` and `go tool gonex create module users --transport none`, then its handwritten users module was extended. Use Go 1.27.1.

```sh
go mod tidy
go tool gonex check
go tool gonex run
```

The framework and development CLI are pinned in go.mod. No local source replacement is needed. POST /api/users accepts name/email, GET /api/users lists an items array, and GET /api/users/{id} retrieves a user. Data is memory-only and disappears on restart. /openapi.json describes the routes. Configuration and logs use the generated config/config.go; .env is not automatically loaded.
