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
		err := addNewUser(newUser, newUserPwd, newUserEmail)

		if err != nil {
			log.Printf("Could not add new user: %+v\n", err)
		}

		// in this case, we don't do anything else here
		return
	}

	fmt.Printf("About to listen on port 10443; go to https://localhost:10443.\n")

	http.HandleFunc("/token", tokenHandler)
	http.Handle("/api/userInfo", handle(&middlewareData{}, ensureAuthentication, userInfo))

	err := http.ListenAndServeTLS(":10443", "cert.pem", "key.pem", nil)

	if err != nil {
		log.Println("Could not start the server.")
	}
}
