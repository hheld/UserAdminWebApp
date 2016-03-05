package main

import (
	"bytes"
	"encoding/gob"
	"github.com/hashicorp/go-plugin"
	"html/template"
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
	resp.Resp, resp.ErrMsg = s.Impl.Handler(actualArgs.Data, actualArgs.Path)
	return nil
}

func (s *ServerRouteRPCServer) Name(args interface{}, resp *string) error {
	*resp = s.Impl.Name()
	return nil
}

type Args struct {
	Data *MiddlewareData
	Path string
}

type Resp struct {
	Resp   []byte
	ErrMsg string
}

type AdditionalServerRouteHandler interface {
	Handler(data *MiddlewareData, path string) ([]byte, string)
	Name() string
}

type Implementation struct{}

func (Implementation) Handler(data *MiddlewareData, path string) ([]byte, string) {
	t, err := template.New("plugin").Parse(mainPage)

	if err != nil {
		return nil, err.Error()
	}

	var doc bytes.Buffer
	t.Execute(&doc, nil)

	return doc.Bytes(), ""
}

func (Implementation) Name() string {
	return "SambaConfig"
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
