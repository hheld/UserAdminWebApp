package main

import (
	"encoding/gob"
	"github.com/hashicorp/go-plugin"
	"net/rpc"
)

var handshakeConfig = plugin.HandshakeConfig{
	ProtocolVersion:  1,
	MagicCookieKey:   "SERVER_PLUGIN",
	MagicCookieValue: "routes",
}

var pluginMap = map[string]plugin.Plugin{
	"routeHandlers": new(ServerRoutePlugin),
}

type ServerRoutePlugin struct{}

func (ServerRoutePlugin) Client(b *plugin.MuxBroker, c *rpc.Client) (interface{}, error) {
	return nil, nil
}

func (ServerRoutePlugin) Server(*plugin.MuxBroker) (interface{}, error) {
	return &ServerRouteRPCServer{Impl: new(Implementation)}, nil
}

type ServerRouteRPCServer struct {
	Impl AdditionalServerRouteHandler
}

func (s *ServerRouteRPCServer) Handler(args interface{}, resp *Resp) error {
	actualArgs := args.(Args)
	resp.Resp, resp.ErrMsg = s.Impl.Handler(actualArgs.Data, actualArgs.Path, actualArgs.Method, actualArgs.JSONData)
	return nil
}

func (s *ServerRouteRPCServer) Name(args interface{}, resp *string) error {
	*resp = s.Impl.Name()
	return nil
}

type Args struct {
	Data     *MiddlewareData
	Path     string
	Method   string
	JSONData string
}

type Resp struct {
	Resp   []byte
	ErrMsg string
}

type AdditionalServerRouteHandler interface {
	Handler(data *MiddlewareData, path, method, jsonData string) ([]byte, string)
	Name() string
}

type MiddlewareData struct {
	UserName string   `json:"userName"`
	Email    string   `json:"email"`
	RealName string   `json:"realName"`
	Roles    []string `json:"roles"`
	Id       string   `json:"id"`
}

func init() {
	gob.Register(Args{})
}

func main() {
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: handshakeConfig,
		Plugins:         pluginMap,
	})
}
