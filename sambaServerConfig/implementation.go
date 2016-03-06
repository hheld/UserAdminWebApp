package main

import (
	"bytes"
	"html/template"
	"log"
	"net/url"
)

type Implementation struct{}

func (Implementation) Handler(data *MiddlewareData, path, method string, formData url.Values) ([]byte, string) {
	t, err := template.New("plugin").Parse(mainPage)
	log.Printf("Form data: %+v\n", formData)

	if err != nil {
		return nil, err.Error()
	}

	var doc bytes.Buffer
	t.Execute(&doc, struct {
		Method  string
		JsFuncs []template.JS
	}{
		Method:  method,
		JsFuncs: []template.JS{jsGetCsrfToken, jsSendFormValuesAndUpdateDoc},
	})

	return doc.Bytes(), ""
}

func (Implementation) Name() string {
	return "SambaConfig"
}
