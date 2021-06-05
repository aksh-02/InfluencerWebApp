package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/aksh-02/Influencers/server/models"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	influencers := getInfluencersHelper(nil)
	json.NewEncoder(w).Encode(influencers)
}

func GetVerifiedInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	u, err := url.Parse(r.URL.RequestURI())
	if err != nil {
		panic(err)
	}

	query, _ := url.ParseQuery(u.RawQuery)
	fmt.Println("query", query)

	influencers := getInfluencersHelper(query, true)
	json.NewEncoder(w).Encode(influencers)
}

func GetUnVerifiedInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	influencers := getInfluencersHelper(nil, false)
	json.NewEncoder(w).Encode(influencers)
}

func getInfluencersHelper(query map[string][]string, verified ...bool) []primitive.M {
	var filter primitive.M
	if len(verified) == 0 {
		filter = bson.M{}
	} else {
		filter = bson.M{"verified": verified[0]}
	}

	if val, ok := query["country"]; ok {
		filter["country"] = val[0]
	}

	if val, ok := query["domains[]"]; ok {
		filter["domains"] = bson.M{"$in": val}
	}

	fmt.Println("In getInfluencers filter", filter)

	cur, err := models.InfluencersCollection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	var influencers []primitive.M
	for cur.Next(context.Background()) {
		var influencer bson.M
		e := cur.Decode(&influencer)
		if e != nil {
			log.Fatal(e)
		}
		influencers = append(influencers, influencer)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return influencers
}

func GetInfluencer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

	username := mux.Vars(r)["username"]
	filter := bson.M{"username": username}

	var influencer models.Influencer
	if err := models.InfluencersCollection.FindOne(context.Background(), filter).Decode(&influencer); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	json.NewEncoder(w).Encode(influencer)
}
