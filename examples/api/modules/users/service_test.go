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
