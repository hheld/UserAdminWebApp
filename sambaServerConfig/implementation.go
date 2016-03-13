package main

import ()

type Implementation struct{}

func (Implementation) Handler(data *MiddlewareData, path, method, jsonData string) ([]byte, string) {
	return []byte("Hello from SambaPlugin"), ""
}

func (Implementation) Name() string {
	return "SambaConfig"
}
