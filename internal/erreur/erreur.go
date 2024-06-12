package erreur

import (
	"fmt"
	"net/http"
	"text/template"
)

func ErrorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	errorHtml := ""
	redirect := ""
	switch status {
	case http.StatusNotFound:
		errorHtml = "template/404.html"
		redirect = "/404"
	case http.StatusBadRequest:
		errorHtml = "template/400.html"
		redirect = "/400"
	case http.StatusInternalServerError:
		errorHtml = "template/500.html"
		redirect = "/500"
	}
	tmpl, err := template.ParseFiles(errorHtml)
	if err != nil {
		fmt.Println("Error erreur.go ErrorHandler ParseFile")
		http.Redirect(w, r, redirect, http.StatusSeeOther)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Println("Error erreur.go ErrorHandler Execute")
		http.Redirect(w, r, redirect, http.StatusSeeOther)
	}
}
