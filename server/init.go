package main

import (
	"flag"
	"log"
)

var (
	newUser      string
	newUserPwd   string
	newUserEmail string
)

func init() {
	flag.StringVar(&dbServer, "MongoDBServer", "localhost", "MongoDB server to be used")
	flag.StringVar(&dbPort, "MongoDBPort", "27017", "MongoDB server's port")
	flag.StringVar(&dbName, "MongoDBName", "testUserAdminBackend", "Name of MongoDB database to be used")

	flag.StringVar(&newUser, "NewUser", "", "Add new user with given user name")
	flag.StringVar(&newUserPwd, "Password", "", "New user's password")
	flag.StringVar(&newUserEmail, "Email", "", "New user's email")

	err := connectToDb()

	if err != nil {
		log.Printf("Could not connect to database '%s': %+v\n", dbName, err)
		return
	}
}
