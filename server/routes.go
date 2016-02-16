package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"strings"
	"time"
)

const secretString = "putyoursecretstringhere"

func token(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		err = errors.New("Token endpoint only accepts POST requests!")
		return
	}

	var ud = struct {
		UserName string `json:"userName"`
		Password string `json:"password"`
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&ud)

	userInfo, err := validateUserInDb(ud.UserName, ud.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		log.Printf("Authorization failed for user '%s' : %s", ud.UserName, err)
		return
	}

	token, id, err := generateToken(userInfo)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Could not generate token for user '%s': %s", ud.UserName, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Secure:   true,
		HttpOnly: true,
		Name:     "token",
		Value:    string(token),
		MaxAge:   3600,
	})

	mac := hmac.New(sha256.New, []byte(secretString))
	mac.Write([]byte(id))

	http.SetCookie(w, &http.Cookie{
		Secure:   true,
		HttpOnly: false,
		Name:     "Csrf-token",
		Value:    hex.EncodeToString(mac.Sum(nil)),
		MaxAge:   3600,
	})

	w.WriteHeader(http.StatusOK)
	return
}

func generateToken(userInfo *User) ([]byte, string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["exp"] = time.Now().Add(1 * time.Hour).Unix()
	token.Claims["iat"] = time.Now().Unix()

	id := make([]byte, 32)
	_, err := rand.Read(id)

	if nil != err {
		return nil, "", err
	}

	clientId := hex.EncodeToString(id)

	token.Claims["jti"] = clientId

	token.Claims["userInfo"] = map[string]interface{}{
		"userName": userInfo.UserName,
		"email":    userInfo.Email,
		"realName": userInfo.RealName,
		"roles":    strings.Join(userInfo.Roles, ","),
	}

	tokenString, err := token.SignedString([]byte(secretString))

	return []byte(tokenString), clientId, err
}

func userInfo(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	return json.NewEncoder(w).Encode(*data)
}

func allUsers(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	users, err := allUsersInDb()

	if err != nil {
		return
	}

	numOfUsers := len(users)
	userData := make([]middlewareData, numOfUsers)

	for idx, user := range users {
		userData[idx].Email = user.Email
		userData[idx].RealName = user.RealName
		userData[idx].UserName = user.UserName
		userData[idx].Roles = user.Roles
		userData[idx].Id = user.Id.Hex()
	}

	return json.NewEncoder(w).Encode(userData)
}

func deleteUser(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	var ud = struct {
		UserId string `json:"userId"`
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&ud)

	return deleteUserFromDb(ud.UserId)
}

func updateUser(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	userData := middlewareData{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&userData)

	updatedUserData := User{
		Id:       bson.ObjectIdHex(userData.Id),
		Email:    userData.Email,
		UserName: userData.UserName,
		RealName: userData.RealName,
		Roles:    userData.Roles,
	}

	return updateUserInDb(&updatedUserData)
}
