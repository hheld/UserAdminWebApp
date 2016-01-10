package main

import (
	"log"
	"net/http"
)

type middlewareData struct {
	userName string
}

type handler func(data *middlewareData, w http.ResponseWriter, r *http.Request) error

func handle(data *middlewareData, handlers ...handler) http.Handler {
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
