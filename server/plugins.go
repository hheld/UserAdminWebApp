package main

import (
	"encoding/gob"
	//"errors"
	"fmt"
	"github.com/hashicorp/go-plugin"
	"log"
	"net/http"
	"net/rpc"
	"net/url"
	"os/exec"
)

var handshakeConfig = plugin.HandshakeConfig{
	ProtocolVersion:  1,
	MagicCookieKey:   "SERVER_PLUGIN",
	MagicCookieValue: "routes",
}

var pluginMap = map[string]plugin.Plugin{
	"routeHandlers": new(ServerRoutePlugin),
}

var pluginNames []string = make([]string, 0)

type AdditionalServerRouteHandler interface {
	Handler(data *MiddlewareData, path, method string, formData url.Values) ([]byte, string)
	Name() string
}

type ServerRoutePlugin struct{}

func (ServerRoutePlugin) Client(b *plugin.MuxBroker, c *rpc.Client) (interface{}, error) {
	return &ServerRouteRPC{client: c}, nil
}

func (ServerRoutePlugin) Server(*plugin.MuxBroker) (interface{}, error) {
	return nil, nil
}

type ServerRouteRPC struct{ client *rpc.Client }

type Args struct {
	Data     *MiddlewareData
	Path     string
	Method   string
	FormData url.Values
}

type Resp struct {
	Resp   []byte
	ErrMsg string
}

func (sr *ServerRouteRPC) Handler(data *MiddlewareData, path, method string, formData url.Values) ([]byte, string) {
	var i interface{} = &Args{
		Data:     data,
		Path:     path,
		Method:   method,
		FormData: formData,
	}

	var r Resp = Resp{
		Resp:   []byte{},
		ErrMsg: "",
	}

	err := sr.client.Call("Plugin.Handler", &i, &r)

	if err != nil {
		log.Fatal(err)
	}

	return r.Resp, r.ErrMsg
}

func (sr *ServerRouteRPC) Name() string {
	var name string

	err := sr.client.Call("Plugin.Name", new(interface{}), &name)

	if err != nil {
		log.Fatal(err)
	}

	return name
}

func init() {
	gob.Register(Args{})

	routePlugins, _ := plugin.Discover("Server_*_plugin", "./plugins")

	for _, routePlugin := range routePlugins {
		client := plugin.NewClient(&plugin.ClientConfig{
			HandshakeConfig: handshakeConfig,
			Plugins:         pluginMap,
			Cmd:             exec.Command(routePlugin),
			Managed:         true,
		})

		rpcClient, err := client.Client()
		if err != nil {
			log.Fatal(err)
		}

		rawPlugin, err := rpcClient.Dispense("routeHandlers")
		if err != nil {
			log.Fatal(err)
		}

		pluginInstance := rawPlugin.(AdditionalServerRouteHandler)

		pluginName := pluginInstance.Name()

		fmt.Println("Found plugin with name", pluginName)

		pluginNames = append(pluginNames, pluginName)

		pluginHandlerFunc := func(data *MiddlewareData, w http.ResponseWriter, r *http.Request) error {
			http.StripPrefix("/plugin/"+pluginName+"/", http.FileServer(http.Dir("./plugins/dist"))).ServeHTTP(w, r)
			return nil
		}

		http.Handle("/plugin/"+pluginName+"/", handle(&MiddlewareData{}, printLog, ensureAuthentication, pluginHandlerFunc))
	}

	if len(routePlugins) == 0 {
		log.Println("No route plugins found.")
	}
}
