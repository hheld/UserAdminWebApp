package main

import (
	"net/url"
)

type Implementation struct{}

func (Implementation) Handler(data *MiddlewareData, path, method string, formData url.Values) ([]byte, string) {
	return []byte("Hello from SambaPlugin"), ""
}

func (Implementation) Name() string {
	return "SambaConfig"
}
