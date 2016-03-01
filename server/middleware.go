package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"os"
	//"strings"
	"strings"
	"time"
)

type MiddlewareData struct {
	UserName string   `json:"userName"`
	Email    string   `json:"email"`
	RealName string   `json:"realName"`
	Roles    []string `json:"roles"`
	Id       string   `json:"id"`
}

type handler func(data *MiddlewareData, w http.ResponseWriter, r *http.Request) error

func handle(data *MiddlewareData, handlers ...handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for _, handler := range handlers {
			err := handler(data, w, r)
			if err != nil {
				log.Printf("There was an error: %v", err)
				return
			}
		}
	})
}

func ensureAuthentication(data *MiddlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	tokenStr, err := req.Cookie("token")

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenStr.Value, func(token *jwt.Token) (interface{}, error) {
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

	// protect from CSRF ###############################################################################################
	jti := token.Claims["jti"]

	mac := hmac.New(sha256.New, []byte(secretString))
	mac.Write([]byte(jti.(string)))
	expectedMAC := mac.Sum(nil)
	xsrfToken, err := hex.DecodeString(req.Header.Get("X-Csrf-Token"))

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !hmac.Equal(xsrfToken, expectedMAC) {
		err = errors.New("XSRF token is invalid!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// #################################################################################################################

	data.UserName = token.Claims["userInfo"].(map[string]interface{})["userName"].(string)
	data.Email = token.Claims["userInfo"].(map[string]interface{})["email"].(string)
	data.RealName = token.Claims["userInfo"].(map[string]interface{})["realName"].(string)
	data.Roles = strings.Split(token.Claims["userInfo"].(map[string]interface{})["roles"].(string), ",")

	return
}

func printLog(data *MiddlewareData, w http.ResponseWriter, req *http.Request) (err error) {
	log.Printf("%s %s", req.URL, req.RemoteAddr)
	return
}

func serveFilesFromDir(directory string) handler {
	return func(data *MiddlewareData, w http.ResponseWriter, r *http.Request) error {
		htmlIndexFile := fmt.Sprintf("%s/index.html", directory)
		requestedFileCandidate := fmt.Sprintf("%s/%s", directory, r.URL.Path[1:])

		if _, err := os.Stat(requestedFileCandidate); os.IsNotExist(err) {
			http.ServeFile(w, r, htmlIndexFile)
		} else {
			http.ServeFile(w, r, requestedFileCandidate)
		}

		return nil
	}
}
