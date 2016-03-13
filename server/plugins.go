package main

import (
	"encoding/gob"
	"encoding/json"
	"fmt"
	"github.com/hashicorp/go-plugin"
	"github.com/juju/errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/rpc"
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
	ApiHandler(data *MiddlewareData, path, method, jsonData string) ([]byte, string)
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
	JSONData string
}

type Resp struct {
	Resp   []byte
	ErrMsg string
}

func (sr *ServerRouteRPC) ApiHandler(data *MiddlewareData, path, method, jsonData string) ([]byte, string) {
	var i interface{} = &Args{
		Data:     data,
		Path:     path,
		Method:   method,
		JSONData: jsonData,
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

		apiHandlerFunc := func(data *MiddlewareData, w http.ResponseWriter, r *http.Request) error {
			body, err := ioutil.ReadAll(r.Body)

			if err != nil {
				return err
			}

			jsonResponse, errMsg := pluginInstance.ApiHandler(data, r.URL.Path, r.Method, string(body))

			if errMsg != "" {
				return errors.New(errMsg)
			}

			encoder := json.NewEncoder(w)
			return encoder.Encode(jsonResponse)
		}

		http.Handle("/plugin/"+pluginName+"/", handle(&MiddlewareData{}, printLog, ensureAuthentication, pluginHandlerFunc))
		http.Handle("/plugin/"+pluginName+"/api/", handle(&MiddlewareData{}, printLog, ensureAuthentication, apiHandlerFunc))
	}

	if len(routePlugins) == 0 {
		log.Println("No route plugins found.")
	}
}
