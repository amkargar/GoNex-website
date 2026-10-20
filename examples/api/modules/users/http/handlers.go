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
