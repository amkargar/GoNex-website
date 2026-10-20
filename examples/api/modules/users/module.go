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
