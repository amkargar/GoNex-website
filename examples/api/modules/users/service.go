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
