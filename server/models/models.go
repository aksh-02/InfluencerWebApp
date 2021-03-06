package models

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	Id        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username  string             `json:"username" bson:"username" validate:"required,min=2,max=100"`
	Password  string             `json:"password" validate:"required,min=8"`
	Email     string             `json:"email" validate:"email,required"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt"`
}

type SocialMediaProfiles struct {
	Instagram string `json:"instagram,omitempty"`
	Twitter   string `json:"twitter,omitempty"`
	Youtube   string `json:"youtube,omitempty"`
}

type Review struct {
	Rating   int    `json:"rating" bson:"rating"`
	Comments string `json:"comments" bson:"comments"`
	Reviewer string `json:"reviewer" bosn:"reviewer"`
}

type Stats struct {
	Rank  int    `json:"rank" bson:"rank"`
	Reach string `json:"reach" bson:"reach"`
}

type Influencer struct {
	Id             primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	Username       string              `json:"username" bson:"username"`
	Name           string              `json:"name" bson:"name"`
	About          string              `json:"about" bson:"about"`
	Verified       bool                `json:"verified" bson:"verified"`
	Country        string              `json:"country" bson:"country"`
	Domains        []string            `json:"domains" bson:"domains"`
	Social         SocialMediaProfiles `json:"social" bson:"social"`
	ProfilePicture string              `json:"profilePicture" bson:"profilePicture"`
	Stats          Stats               `json:"stats" bson:"stats"`
	Reviews        []Review            `json:"reviews" bson:"reviews"`
}

type Message struct {
	Id        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Message   string             `json:"message" bson:"message"`
	Sender    string             `json:"sender" bson:"sender"`
	Receiver  string             `json:"receiver" bson:"receiver"`
	Timestamp time.Time          `json:"timestamp"`
}

type Job struct {
	Id           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title        string             `json:"title" bson:"title"`
	Details      string             `json:"details" bson:"details"`
	PostedBy     string             `json:"postedby" bson:"postedby"`
	CreatedAt    time.Time          `json:"createdAt"`
	Compensation string             `json:"compensation" bson:"compensation"`
	Active       bool               `json:"active" bson:"active"`
}

var InfluencersCollection *mongo.Collection
var UsersCollection *mongo.Collection
var MessagesCollection *mongo.Collection
var JobsCollection *mongo.Collection

func GetDbClient(ctx context.Context) (*mongo.Client, error) {
	uri := os.Getenv("INFLUENCER_URI")

	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Printf("Couldn't connect to the InfluencersService database : %v\n", err)
		return nil, err
	}

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}
	fmt.Println("Connected to InfluencersService database")

	dbName := "InfluencersService"

	InfluencersCollection = client.Database(dbName).Collection("Influencers")
	UsersCollection = client.Database(dbName).Collection("Users")
	MessagesCollection = client.Database(dbName).Collection("Messages")
	JobsCollection = client.Database(dbName).Collection("Jobs")

	return client, nil
}
