package main

import (
	"flag"
	"fmt"
	"github.com/hashicorp/go-plugin"
	"log"
	"net/http"
	"os"
	"os/signal"
)

func main() {
	cleanup := func() {
		dbSession.Close()
		plugin.CleanupClients()
	}

	defer cleanup()

	flag.Parse()

	if newUser != "" && newUserPwd != "" && newUserEmail != "" {
		err := addNewUser(newUser, newUserPwd, newUserEmail, newUserRealName)

		if err != nil {
			log.Printf("Could not add new user: %+v\n", err)
		}

		// in this case, we don't do anything else here
		return
	}

	fmt.Printf("About to listen on port 10443; go to https://localhost:10443.\n")

	http.Handle("/", handle(nil, printLog, serveFilesFromDir("client")))
	http.Handle("/token", handle(nil, printLog, token))
	http.Handle("/logout", handle(nil, printLog, logout))
	http.Handle("/pluginLinks", handle(nil, printLog, pluginLinks))

	http.Handle("/api/userInfo", handle(&MiddlewareData{}, printLog, ensureAuthentication, userInfo))
	http.Handle("/api/allUsers", handle(&MiddlewareData{}, printLog, ensureAuthentication, allUsers))
	http.Handle("/api/deleteUser", handle(&MiddlewareData{}, printLog, ensureAuthentication, deleteUser))
	http.Handle("/api/updateUser", handle(&MiddlewareData{}, printLog, ensureAuthentication, updateUser))
	http.Handle("/api/updatePwd", handle(&MiddlewareData{}, printLog, ensureAuthentication, updatePwd))
	http.Handle("/api/addUser", handle(&MiddlewareData{}, printLog, ensureAuthentication, addUser))

	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt)
		<-c
		cleanup()
		os.Exit(1)
	}()

	err := http.ListenAndServeTLS(":10443", "cert.pem", "key.pem", nil)

	if err != nil {
		log.Println("Could not start the server.")
	}
}
