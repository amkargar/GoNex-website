package main

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http/httptest"
	"strings"
	"testing"

	"example.com/shop/modules"
	"github.com/amkargar/gonex"
	"github.com/amkargar/gonex/config"
)

func TestAPI(t *testing.T) {
	a, err := gonex.New(config.Config{Logger: slog.New(slog.NewJSONHandler(io.Discard, nil))})
	if err != nil {
		t.Fatal(err)
	}
	if err = a.Register(modules.All()...); err != nil {
		t.Fatal(err)
	}
	h, err := a.Handler()
	if err != nil {
		t.Fatal(err)
	}
	cases := []struct {
		method, path, body string
		status             int
	}{
		{"GET", "/api/users", "", 200},
		{"POST", "/api/users", `{"name":"Ada","email":"ada@example.com"}`, 201},
		{"GET", "/api/users/1", "", 200},
		{"GET", "/api/users", "", 200},
		{"POST", "/api/users", `{"name":"Ada","email":"ada@example.com"}`, 409},
		{"POST", "/api/users", `{"name":"A","email":"invalid"}`, 422},
		{"POST", "/api/users", `{"name":"Ada","email":"ada@example.com","unexpected":true}`, 400},
		{"GET", "/api/users/999", "", 404},
		{"GET", "/openapi.json", "", 200},
	}
	for _, tc := range cases {
		r := httptest.NewRequest(tc.method, tc.path, strings.NewReader(tc.body))
		if tc.body != "" {
			r.Header.Set("Content-Type", "application/json")
		}
		w := httptest.NewRecorder()
		h.ServeHTTP(w, r)
		if w.Code != tc.status {
			t.Fatalf("%s %s: %d %s", tc.method, tc.path, w.Code, w.Body.String())
		}
		var result map[string]any
		if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
			t.Fatal(err)
		}
		if tc.path == "/api/users" && tc.method == "GET" && result["items"] == nil {
			t.Fatal("list should be a JSON array", result)
		}
		if tc.path == "/openapi.json" {
			paths := result["paths"].(map[string]any)
			if paths["/api/users"] == nil || paths["/api/users/{id}"] == nil {
				t.Fatal(paths)
			}
		}
	}
}
