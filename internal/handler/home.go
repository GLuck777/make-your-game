package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"
	"text/template"

	"make_your_game/internal/erreur"
)

type Data struct {
	Mode     string
	Name     string `json:"name"`
	TimeGame string `json:"time"`
	Score    string `json:"score"`
}
type Mode struct {
	Mode string
}

var (
	DataJson *os.File
	fichier  *os.File
	err      error
)

type ByScore []Data

func (a ByScore) Len() int      { return len(a) }
func (a ByScore) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByScore) Less(i, j int) bool {
	scoreI, errI := strconv.Atoi(a[i].Score)
	scoreJ, errJ := strconv.Atoi(a[j].Score)

	// Gérer les erreurs de conversion (optionnel, selon votre cas d'utilisation)
	if errI != nil || errJ != nil {
		fmt.Printf("Erreur lors de la conversion des scores: %v, %v\n", errI, errJ)
		return false
	}

	// Comparaison par score
	if scoreI != scoreJ {
		return scoreI > scoreJ // Notez le changement ici pour comparer les entiers
	}
	// En cas d'égalité de score, comparer par temps (le temps le plus bas d'abord)
	return a[i].TimeGame < a[j].TimeGame
}

// Handler main page
func Home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		erreur.ErrorHandler(w, r, http.StatusNotFound)
	}
	tmpl := template.Must(template.ParseFiles("template/index.html"))
	err := tmpl.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		erreur.ErrorHandler(w, r, http.StatusInternalServerError)
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// Called as an handler for api score
func ApiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Println("r.Method:", r.Method)

	if r.Method == "POST" {

		var data Data
		// var mode Mode
		// json.NewDecoder(r.Body).Decode(&mode)
		errJsonDecoder := json.NewDecoder(r.Body).Decode(&data)
		if errJsonDecoder != nil {
			http.Error(w, "error line 34 home.go:", http.StatusInternalServerError)
			return
		}
		fmt.Println("<<< data:", data)
		fmt.Println("mode: ", data.Mode, "!!")

		// Lecture des données JSON existantes depuis le fichier
		var DataContents []Data
		if data.Mode == "story" {
			DataJson, err = os.Open("data.json")
		} else {
			DataJson, err = os.Open("dataEndless.json")
		}
		if err != nil {
			fmt.Println("Erreur lors de l'ouverture du fichier JSON existant :", err)
			return
		}
		if errJson := json.NewDecoder(DataJson).Decode(&DataContents); errJson != nil {
			fmt.Println("Erreur lors de la lecture du fichier JSON existant :", errJson)
			DataJson.Close()
			return
		}
		DataJson.Close()

		// Ajout des nouvelles données aux données existantes
		DataContents = append(DataContents, data)

		// Tri des données par score et ensuite par temps
		sort.Sort(ByScore(DataContents))

		// Ne conserver que les 10 meilleures entrées si la longueur dépasse 10
		if len(DataContents) > 20 {
			DataContents = DataContents[:20]
		}

		// Écriture des données mises à jour dans le fichier JSON
		if data.Mode == "story" {
			fichier, err = os.Create("data.json")
		} else {
			fichier, err = os.Create("dataEndless.json")
		}
		if err != nil {
			fmt.Println("Erreur lors de la création du fichier :", err)
			return
		}
		defer fichier.Close()

		encodeur := json.NewEncoder(fichier)
		if err := encodeur.Encode(DataContents); err != nil {
			fmt.Println("Erreur lors de l'encodage JSON :", err)
			return
		}

		fmt.Println("Nouvelles données écrites avec succès dans le fichier data.json")
	}
}

func StoryJSONHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == http.MethodGet { // Assurez-vous que c'est une requête GET
		w.Header().Set("Content-Type", "application/json")
		file, err := os.ReadFile("data.json") // Utilisez ReadFile pour lire le contenu du fichier
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(file) // Envoie le contenu du fichier directement comme réponse
	}
}

func EndlessJSONHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == http.MethodGet { // Assurez-vous que c'est une requête GET
		w.Header().Set("Content-Type", "application/json")
		file, err := os.ReadFile("dataEndless.json") // Utilisez ReadFile pour lire le contenu du fichier
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(file) // Envoie le contenu du fichier directement comme réponse
	}
}
