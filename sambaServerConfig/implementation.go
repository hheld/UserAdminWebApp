package main

import (
	"bytes"
	"html/template"
)

type Implementation struct{}

func (Implementation) Handler(data *MiddlewareData, path, method string) ([]byte, string) {
	t, err := template.New("plugin").Parse(mainPage)

	if err != nil {
		return nil, err.Error()
	}

	var doc bytes.Buffer
	t.Execute(&doc, struct{ Method string }{Method: method})

	return doc.Bytes(), ""
}

func (Implementation) Name() string {
	return "SambaConfig"
}
