package main

// No documentation? It cant go on like this, can it?

// it can

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
)

type PlayerRequest struct {
	PlayerID string `json:"player_id"`
}

type FPLResponse struct {
	ID         int    `json:"id"`
	FirstName  string `json:"first_name"`
	SecondName string `json:"second_name"`
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func getFPLData(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req PlayerRequest
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate player ID
	playerID, err := strconv.Atoi(req.PlayerID)
	if err != nil || playerID <= 0 {
		http.Error(w, "Invalid player ID", http.StatusBadRequest)
		return
	}

	// Call FPL API
	fplURL := fmt.Sprintf("https://fantasy.premierleague.com/api/element-summary/%d/", playerID)
	resp, err := http.Get(fplURL)
	if err != nil {
		http.Error(w, "Failed to fetch FPL data", http.StatusInternalServerError)
		return
	}

	// Use closeOrLog helper to close response body
	defer closeOrLog(resp.Body, "HTTP response body")

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "FPL API returned error", resp.StatusCode)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}

	// Set content type and return the FPL data
	w.Header().Set("Content-Type", "application/json")

	// Use writeOrLog helper to write response
	writeOrLog(w, body, "FPL API response body")

}

func main() {
	http.HandleFunc("/api/fpl", getFPLData)

	fmt.Println("Backend server starting on :3080")
	log.Fatal(http.ListenAndServe(":3080", nil))
}
