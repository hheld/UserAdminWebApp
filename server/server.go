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

	fmt.Printf("About to listen on port 3000; go to http://localhost:3000.\n")

	http.HandleFunc("/token", tokenHandler)

	err := http.ListenAndServe(":3000", nil)

	if err != nil {
		log.Println("Could not start the server.")
	}
}
