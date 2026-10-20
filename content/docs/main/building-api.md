---
title: "Build a REST API"
description: "Build create, list and get user endpoints in a CLI-generated Gonex app, using schemas.go validation, explicit services and OpenAPI."
order: 30
version: "main"
section: "build"
group: "GETTING STARTED"
---

## Create a separate API project

Use Go 1.27.2. Start in an empty parent directory, not inside the quick-start shop:

```sh
go install github.com/amkargar/gonex/cmd/gonex@8124ffe157a0
gonex new api --module example.com/shop
cd api
go mod tidy
go tool gonex create module users --transport none
```

We start with a generated business module and add its handwritten HTTP adapter below. `--transport none` avoids a starter `/users` route while we define the complete resource contract. The normal HTTP scaffold is covered in [Quick start](/docs/main/quick-start/).

Keep the generated main.go, config/config.go, modules/registry_gen.go and .gonex.json. Replace the generated users service/module files with the following code, create `modules/users/http/`, and replace the starter service test with your own tests. The [complete tested source](https://github.com/amkargar/GoNex-website/tree/main/examples/api) includes these exact files and API tests. You can copy the files into your generated app; cloning either repository is unnecessary.

## Define the business service

Replace `modules/users/service.go`. This example stores users in memory with concurrent access protection. Data is lost on restart; add a repository for persistence.

```go
package users

import (
	"context"
	"strconv"
	"sync"

	apperrors "github.com/amkargar/gonex/errors"
	"github.com/amkargar/gonex/observability"
)

type User struct{ ID, Name, Email string }
type Service struct {
	mu    sync.RWMutex
	users []User
}

func NewService() *Service { return &Service{} }

func (s *Service) Create(ctx context.Context, name, email string) (User, error) {
	if err := ctx.Err(); err != nil {
		return User{}, err
	}
	s.mu.Lock()
	for _, u := range s.users {
		if u.Email == email {
			s.mu.Unlock()
			return User{}, apperrors.New(apperrors.Conflict, "email already exists")
		}
	}
	user := User{ID: strconv.Itoa(len(s.users) + 1), Name: name, Email: email}
	s.users = append(s.users, user)
	s.mu.Unlock()
	observability.Logger(ctx, nil).InfoContext(ctx, "user created", "module", "users", "user_id", user.ID)
	return user, nil
}
func (s *Service) List(ctx context.Context) ([]User, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]User(nil), s.users...), nil
}
func (s *Service) Get(ctx context.Context, id string) (User, error) {
	if err := ctx.Err(); err != nil {
		return User{}, err
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, u := range s.users {
		if u.ID == id {
			return u, nil
		}
	}
	return User{}, apperrors.New(apperrors.NotFound, "user not found")
}
```

## Define request and response schemas

Create `modules/users/http/schemas.go`. The body wrapper declares JSON binding; validation rejects invalid names/emails before the service is called.

```go
package usershttp

type CreateBody struct {
	Name  string `json:"name" validate:"required,min=2,max=80"`
	Email string `json:"email" validate:"required,email,max=254"`
}
type CreateRequest struct {
	Body CreateBody `body:"true"`
}
type GetRequest struct {
	ID string `path:"id" validate:"required"`
}
type UserResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
type ListResponse struct {
	Items []UserResponse `json:"items"`
}

type ListRequest struct{}
```

## Map requests to actions

Create `modules/users/http/handlers.go`. The HTTP adapter accepts explicit actions and does not import database models.

```go
package usershttp

import "context"

type Actions struct {
	Create func(context.Context, string, string) (UserResponse, error)
	List   func(context.Context) ([]UserResponse, error)
	Get    func(context.Context, string) (UserResponse, error)
}
type Handler struct{ Actions Actions }

func (h Handler) Create(ctx context.Context, in CreateRequest) (UserResponse, error) {
	return h.Actions.Create(ctx, in.Body.Name, in.Body.Email)
}
func (h Handler) List(ctx context.Context, _ ListRequest) (ListResponse, error) {
	items, err := h.Actions.List(ctx)
	return ListResponse{Items: items}, err
}
func (h Handler) Get(ctx context.Context, in GetRequest) (UserResponse, error) {
	return h.Actions.Get(ctx, in.ID)
}
```

## Register typed endpoints

Create `modules/users/http/routes.go`. Declare the actual response statuses and domain errors so OpenAPI matches runtime behavior.

```go
package usershttp

import transport "github.com/amkargar/gonex/http"

func Register(r transport.EndpointRegistrar, actions Actions) error {
	h := Handler{Actions: actions}
	if err := transport.Register(r, transport.Endpoint[CreateRequest, UserResponse]{
		Method: "POST", Path: "/api/users", OperationID: "createUser", Summary: createSummary,
		Tags: []string{"users"}, Status: 201, Errors: []int{409}, Handler: h.Create,
	}); err != nil {
		return err
	}
	if err := transport.Register(r, transport.Endpoint[ListRequest, ListResponse]{
		Method: "GET", Path: "/api/users", OperationID: "listUsers", Summary: listSummary,
		Tags: []string{"users"}, Status: 200, Handler: h.List,
	}); err != nil {
		return err
	}
	return transport.Register(r, transport.Endpoint[GetRequest, UserResponse]{
		Method: "GET", Path: "/api/users/:id", OperationID: "getUser", Summary: getSummary,
		Tags: []string{"users"}, Status: 200, Errors: []int{404}, Handler: h.Get,
	})
}
```

Create `modules/users/http/openapi.go`:

```go
package usershttp

const (
	createSummary = "Create a user"
	listSummary   = "List users"
	getSummary    = "Get a user"
)
```

## Wire the module

Replace `modules/users/module.go`. Explicit mapping keeps service values separate from HTTP DTOs. The existing generated module registry already registers `users.Module{}`; do not edit it.

```go
package users

import (
	"context"
	usershttp "example.com/shop/modules/users/http"
	"github.com/amkargar/gonex/app"
)

type Module struct{ Service *Service }

func (m Module) Register(r *app.Registrar) error {
	service := m.Service
	if service == nil {
		service = NewService()
	}
	response := func(u User) usershttp.UserResponse {
		return usershttp.UserResponse{ID: u.ID, Name: u.Name, Email: u.Email}
	}
	return usershttp.Register(r, usershttp.Actions{
		Create: func(ctx context.Context, name, email string) (usershttp.UserResponse, error) {
			u, err := service.Create(ctx, name, email)
			return response(u), err
		},
		Get: func(ctx context.Context, id string) (usershttp.UserResponse, error) {
			u, err := service.Get(ctx, id)
			return response(u), err
		},
		List: func(ctx context.Context) ([]usershttp.UserResponse, error) {
			users, err := service.List(ctx)
			items := make([]usershttp.UserResponse, 0, len(users))
			for _, u := range users {
				items = append(items, response(u))
			}
			return items, err
		},
	})
}
```

## Replace the starter test

Replace `modules/users/service_test.go` (the original test calls the starter Message method):

```go
package users

import (
	"context"
	"sync"
	"testing"
)

func TestConcurrentCreateAndRead(t *testing.T) {
	s := NewService()
	ctx := context.Background()
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); _, _ = s.Create(ctx, "Ada", "ada@example.com"); _, _ = s.List(ctx) }()
	}
	wg.Wait()
	users, err := s.List(ctx)
	if err != nil || len(users) != 1 {
		t.Fatal(users, err)
	}
	if _, err = s.Get(ctx, users[0].ID); err != nil {
		t.Fatal(err)
	}
}
```

## Run your API

```sh
go mod tidy
go tool gonex check
go tool gonex run
```

The terminal shows your local server and OpenAPI URLs. The standard generated configuration reads HTTP_ADDRESS and log settings; see [logging](/docs/main/logging/).

Create a user (POSIX shell; on PowerShell use `curl.exe` with the appropriate JSON quoting or `Invoke-RestMethod`):

```sh
curl -i http://127.0.0.1:8080/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com"}'
```

The response is `201 Created`:

```json
{"id":"1","name":"Ada","email":"ada@example.com"}
```

```sh
curl http://127.0.0.1:8080/api/users
curl http://127.0.0.1:8080/api/users/1
curl http://127.0.0.1:8080/openapi.json
```

| Request | Expected behavior |
| --- | --- |
| GET `/api/users` | 200, an `items` array, including an empty array before creation |
| POST valid user | 201, created user |
| POST same email twice | 409 conflict |
| POST invalid name/email | 422 validation error |
| POST malformed JSON or unknown fields | 400 invalid request |
| GET unknown user | 404 not found |

The service emits a `user created` event with module/user ID; its request ID matches the HTTP completion event. Default request logs omit body, token and query-string values. Business log fields are explicit.

## Next steps

This is an explicit resource API, not an automatic ModelViewSet. It has no authentication, pagination, update/delete actions or persistent storage. Add those deliberately using [security](/docs/main/security/), [database adapters](/docs/main/database/) and [HTTP contracts](/docs/main/http/). Connect a frontend through the [JSON API](/docs/main/frontend/).
