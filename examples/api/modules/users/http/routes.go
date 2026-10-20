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
