package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Student struct {
	ID       int    `json:"id"`
	NIM      string `json:"nim"`
	Name     string `json:"name"`
	Faculty  string `json:"faculty"`
	Major    string `json:"major"`
	PhotoURL string `json:"photo_url"`
}

var db *sql.DB

func main() {
	var err error
	// Change database connection to default XAMPP MySQL
	db, err = sql.Open("mysql", "root:@tcp(localhost:3306)/ktm_db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	router := mux.NewRouter()

	// Create uploads directory if it doesn't exist
	os.MkdirAll("uploads", os.ModePerm)

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Accept"},
		AllowCredentials: true,
	})

	// Routes
	router.HandleFunc("/students", getStudents).Methods("GET")
	router.HandleFunc("/students", createStudent).Methods("POST")
	router.HandleFunc("/students/{id}", updateStudent).Methods("PUT") // Changed route pattern
	router.HandleFunc("/students/{id}", deleteStudent).Methods("DELETE")
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	handler := c.Handler(router)
	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func getStudents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, nim, name, faculty, major, photo_url FROM students")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var s Student
		err := rows.Scan(&s.ID, &s.NIM, &s.Name, &s.Faculty, &s.Major, &s.PhotoURL)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		students = append(students, s)
	}

	json.NewEncoder(w).Encode(students)
}

func createStudent(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20) // 10 MB max

	file, handler, err := r.FormFile("photo")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), handler.Filename)
	filepath := filepath.Join("uploads", filename)

	f, err := os.OpenFile(filepath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()

	// Save the file
	buf := make([]byte, 1024)
	for {
		n, err := file.Read(buf)
		if n == 0 || err != nil {
			break
		}
		f.Write(buf[:n])
	}

	// Save to database
	result, err := db.Exec(
		"INSERT INTO students (nim, name, faculty, major, photo_url) VALUES (?, ?, ?, ?, ?)",
		r.FormValue("nim"),
		r.FormValue("name"),
		r.FormValue("faculty"),
		r.FormValue("major"),
		"/uploads/"+filename,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":   true,
		"id":        id,
		"photo_url": "/uploads/" + filename,
	})
}

func updateStudent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get existing student
	var oldPhoto string
	err := db.QueryRow("SELECT photo_url FROM students WHERE id = ?", id).Scan(&oldPhoto)
	if err != nil {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Handle photo upload
	photoURL := oldPhoto
	if file, handler, err := r.FormFile("photo"); err == nil {
		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), handler.Filename)
		newPhotoPath := filepath.Join("uploads", filename)
		
		f, err := os.OpenFile(newPhotoPath, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer f.Close()
		
		if _, err := io.Copy(f, file); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Delete old photo if it exists
		if oldPhoto != "" {
			oldPhotoPath := strings.TrimPrefix(oldPhoto, "/")
			if err := os.Remove(oldPhotoPath); err != nil {
				log.Printf("Error deleting old photo: %v", err)
			}
		}
		photoURL = "/" + newPhotoPath // Add leading slash for URL
	}

	// Update database
	_, err = db.Exec(
		"UPDATE students SET nim=?, name=?, faculty=?, major=?, photo_url=? WHERE id=?",
		r.FormValue("nim"),
		r.FormValue("name"),
		r.FormValue("faculty"),
		r.FormValue("major"),
		photoURL,
		id,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Student updated successfully",
		"photo_url": photoURL,
	})
}

func deleteStudent(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    // Get photo URL before deleting
    var photoURL string
    err := db.QueryRow("SELECT photo_url FROM students WHERE id = ?", id).Scan(&photoURL)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Student not found", http.StatusNotFound)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete the photo file if it exists
    if photoURL != "" {
        // Remove the leading slash and get the correct path
        photoPath := strings.TrimPrefix(photoURL, "/")
        err := os.Remove(photoPath)
        if err != nil {
            log.Printf("Error deleting photo file: %v", err)
        }
    }

    // Delete the database record
    result, err := db.Exec("DELETE FROM students WHERE id = ?", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if rowsAffected == 0 {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true,
        "message": "Student deleted successfully",
    })
}
