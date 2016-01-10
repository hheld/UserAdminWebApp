package main

import (
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
)

type User struct {
	Email        string
	UserName     string
	RealName     string
	PasswordHash []byte
}

var (
	dbServer     string
	dbPort       string
	dbName       string
	dbSession    *mgo.Session
	dbCollection *mgo.Collection
)

const secretString = "put your secret string here"

func connectToDb() (err error) {
	dbSession, err = mgo.Dial(dbServer + ":" + dbPort)

	if err != nil {
		return
	}

	dbCollection = dbSession.DB(dbName).C("users")

	return
}

func addNewUser(userName, pwd, email string) error {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	newUser := User{
		Email:        email,
		UserName:     userName,
		RealName:     "",
		PasswordHash: hashedPwd,
	}

	return dbCollection.Insert(&newUser)
}
