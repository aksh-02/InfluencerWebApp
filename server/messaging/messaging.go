package messaging

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

func SendMessage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var message models.Message
	err := json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		log.Fatal(err)
	}

	message.Timestamp = time.Now()
	insResp, err := models.MessagesCollection.InsertOne(context.Background(), message)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a Single Record ", insResp.InsertedID)
}

func CheckMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var userData map[string]string
	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		log.Fatal(err)
	}

	filter := bson.M{
		"$or": bson.A{
			bson.M{"sender": userData["sender"], "receiver": userData["receiver"]},
			bson.M{"sender": userData["receiver"], "receiver": userData["sender"]},
		},
	}
	cur, err := models.MessagesCollection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	var messages []primitive.M
	for cur.Next(context.Background()) {
		var message bson.M
		e := cur.Decode(&message)
		if e != nil {
			log.Fatal(e)
		}
		messages = append(messages, message)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	json.NewEncoder(w).Encode(messages)
}

func CheckAllMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var userData map[string]string
	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		log.Fatal(err)
	}

	filter := bson.M{
		"$or": bson.A{
			bson.M{"sender": userData["username"]},
			bson.M{"receiver": userData["username"]},
		},
	}
	cur, err := models.MessagesCollection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	messages := make(map[string][]primitive.M)
	// var messages []primitive.M
	for cur.Next(context.Background()) {
		var message bson.M
		e := cur.Decode(&message)
		if e != nil {
			log.Fatal(e)
		}
		if message["sender"] == userData["username"] {
			messages[fmt.Sprintf("%v", message["receiver"])] = append(messages[fmt.Sprintf("%v", message["receiver"])], message)
		} else {
			messages[fmt.Sprintf("%v", message["sender"])] = append(messages[fmt.Sprintf("%v", message["sender"])], message)
		}
		// messages = append(messages, message)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	json.NewEncoder(w).Encode(messages)

}
