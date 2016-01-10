package main

import (
	"flag"
    "log"
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
}
