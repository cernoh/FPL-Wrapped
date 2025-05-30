package main

import (
	"io"
	"log"
	"net/http"
)

// function to close an io.Closer safely
// if an error occurs while closing, log the error and the associated name
func closeOrLog(c io.Closer, name string) {
	if err := c.Close(); err != nil {
		log.Printf("Error closing %q: %v", name, err)
	}
}

// function to write a byte slice to an HTTP response writer
// if an error occurs while writing, log the error and the associated name
func writeOrLog(w http.ResponseWriter, data []byte, name string) {
	if _, err := w.Write(data); err != nil {
		log.Printf("Error writing %q: %v", name, err)
	}
}
