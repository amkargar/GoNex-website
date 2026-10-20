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
