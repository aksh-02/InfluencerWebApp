package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/aksh-02/Influencers/server/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var allowOrigin = "http://localhost:3000"

func GetActiveJobs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	cur, err := models.JobsCollection.Find(context.Background(), bson.M{"active": true})
	if err != nil {
		log.Fatal(err)
	}

	var jobs []primitive.M
	for cur.Next(context.Background()) {
		var job bson.M
		e := cur.Decode(&job)
		if e != nil {
			log.Fatal(e)
		}
		jobs = append(jobs, job)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	json.NewEncoder(w).Encode(jobs)
}

func CreateJob(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var job models.Job
	err := json.NewDecoder(r.Body).Decode(&job)
	if err != nil {
		log.Fatal(err)
	}
	job.CreatedAt = time.Now()
	job.Active = true
	insResp, err := models.JobsCollection.InsertOne(context.Background(), job)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a Single Record ", insResp.InsertedID)
	json.NewEncoder(w).Encode("You've successfully created a new job")
}
