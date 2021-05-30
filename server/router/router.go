package router

import (
	"github.com/aksh-02/Influencers/server/auth"
	"github.com/aksh-02/Influencers/server/jobs"
	"github.com/aksh-02/Influencers/server/messaging"
	"github.com/aksh-02/Influencers/server/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()
	router.HandleFunc("/ok", auth.IsAuthorized(auth.TestPoint)).Methods("GET", "OPTIONS")

	// authentication
	router.HandleFunc("/signup", auth.SignUp).Methods("POST", "OPTIONS")
	router.HandleFunc("/signin", auth.SignIn).Methods("POST", "OPTIONS")
	router.HandleFunc("/logout", auth.Logout).Methods("GET", "OPTIONS")

	// influencer application
	router.HandleFunc("/apply", auth.ApplyAsInfluencer).Methods("POST", "OPTIONS")

	// profile pic upload
	router.HandleFunc("/upload", auth.InfluencerPic).Methods("POST", "OPTIONS")

	// messaging
	router.HandleFunc("/sendmessage", messaging.SendMessage).Methods("POST", "OPTIONS")
	router.HandleFunc("/checkmessages", messaging.CheckMessages).Methods("POST", "OPTIONS")
	router.HandleFunc("/checkallmessages", messaging.CheckAllMessages).Methods("POST", "OPTIONS")

	// jobs
	router.HandleFunc("/createjob", jobs.CreateJob).Methods("POST", "OPTIONS")
	router.HandleFunc("/jobs", jobs.GetActiveJobs).Methods("GET", "OPTIONS")

	// influencers page
	router.HandleFunc("/", middleware.GetVerifiedInfluencers).Methods("GET", "OPTIONS")
	router.HandleFunc("/all", middleware.GetAllInfluencers).Methods("GET", "OPTIONS")
	router.HandleFunc("/unverified", middleware.GetUnVerifiedInfluencers).Methods("GET", "OPTIONS")
	router.HandleFunc("/influencers/{id}", middleware.GetInfluencer).Methods("GET", "OPTIONS")
	return router
}
