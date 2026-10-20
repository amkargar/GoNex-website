package usershttp

import transport "github.com/amkargar/gonex/http"

func Register(r transport.EndpointRegistrar, actions Actions) error {
	h := Handler{Actions: actions}
	return transport.Routes(r,
		transport.Post("/api/users", h.Create).
			Name("createUser").
			Summary(createSummary).
			Tags("users").
			Errors(409),
		transport.Get("/api/users", h.List).
			Name("listUsers").
			Summary(listSummary).
			Tags("users"),
		transport.Get("/api/users/:id", h.Get).
			Name("getUser").
			Summary(getSummary).
			Tags("users").
			Errors(404),
	)
}
