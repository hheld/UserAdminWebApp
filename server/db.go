package main

import (
	"github.com/juju/errors"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	Id           bson.ObjectId `bson:"_id,omitempty"`
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
		PasswordHash: hashedPwd,
	}

	return dbCollection.Insert(&newUser)
}

func validateUserInDb(userName, password string) (userInfo *User, err error) {
	if dbCollection == nil {
		err = errors.New("There is no connection to a database!")
		return
	}

	result := User{}

	err = dbCollection.Find(bson.M{"username": userName}).One(&result)

	if err != nil {
		err = errors.New("No user '" + userName + "' found in the database!")
		return
	}

	return &result, bcrypt.CompareHashAndPassword(result.PasswordHash, []byte(password))
}
