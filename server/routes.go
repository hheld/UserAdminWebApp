package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/juju/errors"
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

	userInfo, err := validateUserInDb(ud.UserName, ud.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		log.Printf("Authorization failed for user '%s' : %s", ud.UserName, err)
		return
	}

	token, err := generateToken(userInfo)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Could not generate token for user '%s': %s", ud.UserName, err)
		return
	}

	w.Write(token)
}

func generateToken(userInfo *User) ([]byte, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["exp"] = time.Now().Add(1 * time.Hour).Unix()
	token.Claims["iat"] = time.Now().Unix()

	id := make([]byte, 32)
	_, err := rand.Read(id)

	if nil != err {
		return nil, err
	}

	token.Claims["jti"] = hex.EncodeToString(id)

	token.Claims["userInfo"] = map[string]interface{}{
		"userName": userInfo.UserName,
		"email":    userInfo.Email,
		"realName": userInfo.RealName,
	}

	tokenString, err := token.SignedString([]byte(secretString))

	return []byte(tokenString), err
}

func ensureAuthentication(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	token, err := jwt.ParseFromRequest(req, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Signing method for token doesn't match: " + token.Header["alg"].(string))
		}

		return []byte(secretString), nil
	})

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if token == nil {
		err = errors.New("No authorization token specified!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !token.Valid {
		err = errors.New("Token is not valid!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if int64(token.Claims["exp"].(float64)) < time.Now().Unix() {
		err = errors.New("Token expired!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	data.userName = token.Claims["userInfo"].(map[string]interface{})["userName"].(string)
    data.email = token.Claims["userInfo"].(map[string]interface{})["email"].(string)
    data.realName = token.Claims["userInfo"].(map[string]interface{})["realName"].(string)

	return
}

func userInfo(data *middlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	fmt.Fprintf(w, "%+v", data)
	return
}
