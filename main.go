package main

import (
	"fmt"
	"net/http"

	"make_your_game/internal/handler"
)

const port = "0.0.0.0:8080"

func main() {
	parseJS := http.FileServer(http.Dir("game"))
	http.Handle("/game/", http.StripPrefix("/game/", parseJS))

	parseTmpl := http.FileServer(http.Dir("template"))
	http.Handle("/template/", http.StripPrefix("/template/", parseTmpl))

	http.HandleFunc("/", handler.Home)

	http.HandleFunc("/api", handler.ApiHandler)

	http.HandleFunc("/StoryJSON", handler.StoryJSONHandler)
	http.HandleFunc("/EndlessJSON", handler.EndlessJSONHandler)

	// fmt.Println("Server has started, it's now accessible on the following address: http://" + port)

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Println("gestion d'erreur 500")
	}
}
