package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/aksh-02/Influencers/server/models"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetAllInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	influencers := getInfluencersHelper()
	json.NewEncoder(w).Encode(influencers)
}

func GetVerifiedInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	influencers := getInfluencersHelper(true)
	json.NewEncoder(w).Encode(influencers)
}

func GetUnVerifiedInfluencers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	influencers := getInfluencersHelper(false)
	json.NewEncoder(w).Encode(influencers)
}

func getInfluencersHelper(verified ...bool) []primitive.M {
	var cur *mongo.Cursor
	var err error
	if len(verified) == 0 {
		cur, err = models.InfluencersCollection.Find(context.Background(), bson.D{{}})
	} else {
		cur, err = models.InfluencersCollection.Find(context.Background(), bson.M{"verified": verified[0]})
	}

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

	id, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	filter := bson.M{"_id": id}

	var influencer models.Influencer
	if err := models.InfluencersCollection.FindOne(context.Background(), filter).Decode(&influencer); err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(influencer)
}
