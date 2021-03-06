package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {
	defer func() {
		dbSession.Close()
	}()

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

	http.Handle("/api/userInfo", handle(&middlewareData{}, printLog, ensureAuthentication, userInfo))
	http.Handle("/api/allUsers", handle(&middlewareData{}, printLog, ensureAuthentication, allUsers))
	http.Handle("/api/deleteUser", handle(&middlewareData{}, printLog, ensureAuthentication, deleteUser))
	http.Handle("/api/updateUser", handle(&middlewareData{}, printLog, ensureAuthentication, updateUser))
	http.Handle("/api/updatePwd", handle(&middlewareData{}, printLog, ensureAuthentication, updatePwd))
	http.Handle("/api/addUser", handle(&middlewareData{}, printLog, ensureAuthentication, addUser))

	err := http.ListenAndServeTLS(":10443", "cert.pem", "key.pem", nil)

	if err != nil {
		log.Println("Could not start the server.")
	}
}
