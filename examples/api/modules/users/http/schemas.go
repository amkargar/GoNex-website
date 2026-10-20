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
