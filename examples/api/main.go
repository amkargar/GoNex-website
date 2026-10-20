package main

import (
	"context"
	"example.com/shop/config"
	"example.com/shop/modules"
	"github.com/amkargar/gonex"
	"github.com/gin-gonic/gin"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	a, err := gonex.New(config.Load())
	if err != nil {
		slog.Error("application initialization failed", "error", err)
		os.Exit(1)
	}
	if err = a.Register(modules.All()...); err != nil {
		a.Logger().Error("module registration failed", "error", err)
		os.Exit(1)
	}
	if (len(os.Args) == 3 || len(os.Args) == 4) && os.Args[1] == "--gonex-openapi" {
		version := ""
		if len(os.Args) == 4 {
			version = os.Args[3]
		}
		document, err := a.OpenAPIVersion(version)
		if err != nil {
			a.Logger().Error("OpenAPI export failed", "error", err)
			os.Exit(1)
		}
		if err = os.WriteFile(os.Args[2], document, 0644); err != nil {
			a.Logger().Error("OpenAPI export failed", "error", err)
			os.Exit(1)
		}
		return
	}
	if err = a.Run(ctx); err != nil {
		os.Exit(1)
	}
}
