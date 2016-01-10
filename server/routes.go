package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"time"
)

const secretString = "putyoursecretstringhere"

func tokenHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		return
	}

	var ud = struct {
		UserName string `json:"userName"`
		Password string `json:"password"`
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&ud)

	err := validateUserInDb(ud.UserName, ud.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		log.Printf("Authorization failed for user '%s' : %s", ud.UserName, err)
		return
	}

	token, err := generateToken(ud.UserName)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Could not generate token for user '%s': %s", ud.UserName, err)
		return
	}

	w.Write(token)
}

func generateToken(userName string) ([]byte, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["exp"] = time.Now().Add(1 * time.Hour).Unix()
	token.Claims["iat"] = time.Now().Unix()

	id := make([]byte, 32)
	_, err := rand.Read(id)

	if nil != err {
		return nil, err
	}

	token.Claims["jti"] = hex.EncodeToString(id)

	token.Claims["scopes"] = map[string]interface{}{
		"user": userName,
	}

	tokenString, err := token.SignedString([]byte(secretString))

	return []byte(tokenString), err
}
