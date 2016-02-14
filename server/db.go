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
	Roles        []string
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

	index := mgo.Index{
		Key:        []string{"username"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err = dbCollection.EnsureIndex(index)

	return
}

func addNewUser(userName, pwd, email, realName string) error {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	newUser := User{
		Email:        email,
		UserName:     userName,
		RealName:     realName,
		PasswordHash: hashedPwd,
		Roles:        []string{"admin"},
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

func allUsersInDb() ([]User, error) {
	if dbCollection == nil {
		return nil, errors.New("There is no connection to a database!")
	}

	var result []User

	if err := dbCollection.Find(bson.M{}).All(&result); err != nil {
		return nil, err
	}

	return result, nil
}
