package main

import (
	"github.com/amkargar/gonex"
	"github.com/amkargar/gonex/config"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDocumentedRoutes(t *testing.T) {
	a, e := gonex.New(config.Config{})
	if e != nil {
		t.Fatal(e)
	}
	if e = a.Register(helloModule{}); e != nil {
		t.Fatal(e)
	}
	h, e := a.Handler()
	if e != nil {
		t.Fatal(e)
	}
	for route, want := range map[string]string{"/api/hello": "Hello from Gonex", "/openapi.json": "hello"} {
		w := httptest.NewRecorder()
		h.ServeHTTP(w, httptest.NewRequest("GET", route, nil))
		if w.Code != 200 || !strings.Contains(w.Body.String(), want) {
			t.Fatalf("%s: status %d, body %s", route, w.Code, w.Body.String())
		}
	}
}
